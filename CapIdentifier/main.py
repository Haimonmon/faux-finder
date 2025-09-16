import math
import csv
import random
import re
import sys


class NaiveBayesCapIdentifier:
    def __init__(self):
        self.class_counts = {}
        self.class_word_counts = {}
        self.vocab_size = 0

    def normalize(self, text):
        # Lowercase + remove special characters + split into tokens
        text = text.lower()
        text = re.sub(r"[^a-z0-9 ]", " ", text)
        return text.split()

    def train(self, filepath, test_ratio=0.2, max_test=None):
        csv.field_size_limit(sys.maxsize)  # <-- Fix for large fields

        data = []
        with open(filepath, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                title = row["title"]
                text = row["text"]
                label = int(row["label"])  # 1 = real, 0 = fake
                content = title + " " + text
                data.append((content, label))

        # Shuffle and split into train/test
        random.shuffle(data)
        split = math.ceil(len(data) * test_ratio)
        test, train = data[:split], data[split:]

        if max_test and len(test) > max_test:
            test = test[:max_test]

        vocab_set = set()
        class_counter = {}
        class_word_counter = {}

        for doc, label in train:
            tokens = self.normalize(doc)
            vocab_set.update(tokens)

            if label not in class_counter:
                class_counter[label] = 0
                class_word_counter[label] = {}

            class_counter[label] += 1

            for token in tokens:
                class_word_counter[label][token] = class_word_counter[label].get(token, 0) + 1

        self.class_counts = class_counter
        self.class_word_counts = class_word_counter
        self.vocab_size = len(vocab_set)

        return test

    def predict(self, text, debug=False):
        tokens = self.normalize(text)
        total_docs = sum(self.class_counts.values())
        scores = {}

        if debug:
            print("\n--- DEBUG MODE ---")
            print("Input text snippet:", text[:300], "...\n")

        for label in self.class_counts.keys():
            # Prior probability
            prob = math.log(self.class_counts[label] / total_docs)
            total_tokens = sum(self.class_word_counts[label].values())

            if debug:
                print(f"Class {label} ({'REAL' if label==1 else 'FAKE'}):")
                print(f"  Prior logP = {prob:.4f}")

            for token in tokens:
                token_count = self.class_word_counts[label].get(token, 0)
                token_prob = (token_count + 1) / (total_tokens + self.vocab_size)
                prob += math.log(token_prob)

                if debug:
                    print(f"   Token '{token}': count={token_count}, "
                          f"P={token_prob:.6f}, logP={math.log(token_prob):.4f}")

            scores[label] = prob

            if debug:
                print(f"  Final logP for class {label} = {prob:.4f}\n")

        best = max(scores, key=scores.get)

        if debug:
            print("--- FINAL DECISION ---")
            print(f"logP(FAKE)={scores.get(0,0):.4f}")
            print(f"logP(REAL)={scores.get(1,0):.4f}")
            print("Predicted:", "REAL" if best == 1 else "FAKE")
            print("----------------------\n")

        return best

    def predict_cap_or_no_cap(self, title, text, debug=False):
        content = title + " " + text
        label = self.predict(content, debug=debug)
        return "REAL" if label == 1 else "FAKE"

if __name__ == "__main__":
    nb = NaiveBayesCapIdentifier()

    # Train dataset
    test_set = nb.train("./data/WELFake_Dataset.csv", test_ratio=0.2, max_test=5000)  

    # Evaluate accuracy
    score = 0
    for doc, label in test_set:
        if nb.predict(doc) == label:
            score += 1
    print("Accuracy:", round(score / len(test_set), 4))

    # Test article
    title = "PCC agrees to extend Grab PH driver incentive program’s regulatory review"
    text = """Grab Philippines and the Philippine Competition Commission (PCC) on Tuesday signed a new accord extending the regulatory review of the company's driver incentive program following its acquisition of Uber’s Southeast Asia business in 2018."""
    print("Prediction:", nb.predict_cap_or_no_cap(title, text, debug=True))

    """
    * dataset reference: https://www.kaggle.com/datasets/saurabhshahane/fake-news-classification?resource=download
    """
