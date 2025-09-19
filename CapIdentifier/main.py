import math
import csv
import random
import re
import sys
import os
from collections import defaultdict, Counter

class NaiveBayesCapIdentifier:
    STOPWORDS = {
        "a","an","the","and","or","but","if","while","for","to","of","at","by","from",
        "on","off","in","out","over","under","with","as","about","after","before",
        "above","below","up","down","into","again","further","then","once","here",
        "there","when","where","why","how","all","any","both","each","few","more",
        "most","other","some","such","no","nor","not","only","own","same","so",
        "than","too","very","can","will","just","don","should","now","is","am","are",
        "was","were","be","been","being","have","has","had","having","do","does",
        "did","doing","this","that","these","those","he","she","it","they","them",
        "his","her","its","their","what","which","who","whom","because","until",
        "wherever","whenever","ours","yours","mine"
    }

    def __init__(self, alpha1=0.4, alpha2=0.3, alpha3=0.3):
        self.class_counts = {}
        self.class_word_counts = {}
        self.bigram_counts = {}
        self.trigram_counts = {}
        self.vocab_size = 0
        self.alpha1 = alpha1
        self.alpha2 = alpha2
        self.alpha3 = alpha3

    def normalize(self, text):
        text = text.lower()
        text = re.sub(r"[^a-z0-9 ]", " ", text)
        return [t for t in text.split() if t not in self.STOPWORDS]

    def train(self, filepath, test_ratio=0.2):
        csv.field_size_limit(sys.maxsize)
        data = []
        with open(filepath, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                headline = row.get("headline", "")
                content  = row.get("content", "")
                label    = int(row["label"])
                data.append((headline + " " + content, label))

        random.shuffle(data)
        split = math.ceil(len(data) * test_ratio)
        test, train = data[:split], data[split:]

        vocab_set = set()
        class_counter = {}
        class_word_counter = {}
        bigram_counter = {}
        trigram_counter = {}

        for doc, label in train:
            tokens = self.normalize(doc)
            vocab_set.update(tokens)

            class_counter.setdefault(label, 0)
            class_word_counter.setdefault(label, Counter())
            bigram_counter.setdefault(label, Counter())
            trigram_counter.setdefault(label, Counter())

            class_counter[label] += 1

            for token in tokens:
                class_word_counter[label][token] += 1

            for i in range(1, len(tokens)):
                bigram = tokens[i-1] + "_" + tokens[i]
                bigram_counter[label][bigram] += 1

            for i in range(2, len(tokens)):
                trigram = tokens[i-2] + "_" + tokens[i-1] + "_" + tokens[i]
                trigram_counter[label][trigram] += 1

        self.class_counts = class_counter
        self.class_word_counts = class_word_counter
        self.bigram_counts = bigram_counter
        self.trigram_counts = trigram_counter
        self.vocab_size = len(vocab_set)
        return test

    def predict(self, text, debug=False):
        tokens = self.normalize(text)
        total_docs = sum(self.class_counts.values())
        log_scores = {}

        for label in self.class_counts:
            log_sum = 0.0
            for i, token in enumerate(tokens):
                total_tokens = sum(self.class_word_counts[label].values())
                p_uni = (self.class_word_counts[label].get(token, 0) + 1) / (total_tokens + self.vocab_size)

                if i > 0:
                    bigram = tokens[i-1] + "_" + token
                    p_bi = (self.bigram_counts[label].get(bigram, 0) + 1) / (total_tokens + self.vocab_size)
                else:
                    p_bi = p_uni

                if i > 1:
                    trigram = tokens[i-2] + "_" + tokens[i-1] + "_" + token
                    p_tri = (self.trigram_counts[label].get(trigram, 0) + 1) / (total_tokens + self.vocab_size)
                else:
                    p_tri = p_bi

                p = self.alpha1*p_uni + self.alpha2*p_bi + self.alpha3*p_tri
                log_sum += math.log(p)

            # Average log per token to avoid underflow
            log_scores[label] = log_sum / max(len(tokens), 1)

        # Convert to percentages
        max_log = max(log_scores.values())
        exp_scores = {lbl: math.exp(v - max_log) for lbl,v in log_scores.items()}
        total = sum(exp_scores.values())
        probs = {lbl: exp_scores[lbl]/total for lbl in exp_scores}

        best_label = max(probs, key=probs.get)

        if debug:
            print(f"\n--- ARTICLE DEBUG ---")
            print(f"FAKE: {probs.get(0,0)*100:.2f}% | REAL: {probs.get(1,0)*100:.2f}%")
            print("Word occurrences per class:")
            for token in tokens:
                c0 = self.class_word_counts.get(0, {}).get(token, 0)
                c1 = self.class_word_counts.get(1, {}).get(token, 0)
                print(f"{token:20s} -> FAKE: {c0:3d} | REAL: {c1:3d}")
            print("--------------------\n")

        return best_label, probs

    def classify_and_append(self, source_csv, dataset_csv, debug=False):
        if not os.path.exists(dataset_csv):
            raise FileNotFoundError(f"{dataset_csv} not found.")

        # Track existing headlines+urls to avoid duplicates
        existing = set()
        with open(dataset_csv, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for r in reader:
                key = ((r.get("headline") or "").strip(),
                       (r.get("url") or "").strip())
                existing.add(key)

        with open(source_csv, "r", encoding="utf-8") as fin, \
             open(dataset_csv, "a", newline="", encoding="utf-8") as fout:

            reader = csv.DictReader(fin)
            fieldnames = ["headline", "content", "label", "author", "url", "fake_pct", "real_pct"]
            writer = csv.DictWriter(fout, fieldnames=fieldnames)

            for row in reader:
                key = ((row.get("headline") or "").strip(),
                       (row.get("url") or "").strip())
                if key in existing:
                    continue

                title   = row.get("headline", "")
                content = row.get("content", "")
                author  = row.get("author", "")
                url     = row.get("url", "")
                label, probs = self.predict(title + " " + content, debug=debug)

                writer.writerow({
                    "headline": title,
                    "content":  content,
                    "label":    label,
                    "author":   author,
                    "url":      url,
                    "fake_pct": round(probs.get(0,0)*100, 2),
                    "real_pct": round(probs.get(1,0)*100, 2)
                })

                if debug:
                    print(f"Appended -> Label {label} | FAKE: {probs.get(0,0)*100:.2f}% | REAL: {probs.get(1,0)*100:.2f}% | {title[:60]}...")

if __name__ == "__main__":
    TRAIN_FILE   = "./data/final_en.csv"
    NEW_ARTICLES = "./data/news.csv"

    nb = NaiveBayesCapIdentifier()
    test_set = nb.train(TRAIN_FILE, test_ratio=0.2)
    acc = sum(nb.predict(doc)[0] == lbl for doc, lbl in test_set) / len(test_set)
    print(f"Validation Accuracy: {acc:.2%}")

    nb.classify_and_append(NEW_ARTICLES, TRAIN_FILE, debug=True)
