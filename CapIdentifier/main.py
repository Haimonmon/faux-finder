import math

class NoCapIdentifier:
    def __init__(self):
        self.word_counts = {"fake": {}, "real": {}}
        self.class_counts = {"fake": 0, "real": 0}
        self.total_words = {"fake": 0, "real": 0}
        self.vocab_size = 0

    def tokenize(self, text):
        """Convert text into lowercase tokens."""
        return text.lower().replace("!", "").replace(",", "").replace(".", "").split()

    def train_cap_or_no_cap(self, dataset):
        """
        Train model on dataset (list of (text, label)).
        label = 'fake' or 'real'
        """
        for text, label in dataset:
            self.class_counts[label] += 1
            words = self.tokenize(text)
            for w in words:
                self.word_counts[label][w] = self.word_counts[label].get(w, 0) + 1
                self.total_words[label] += 1

        # Build vocabulary
        vocab = set()
        for label in self.word_counts:
            for w in self.word_counts[label]:
                vocab.add(w)
        self.vocab_size = len(vocab)

    def predict_cap_or_no_cap(self, text):
        """
        Predict whether article is fake or real.
        Returns: (predicted_label, probabilities)
        """
        words = self.tokenize(text)
        total_docs = sum(self.class_counts.values())
        log_scores = {}

        for c in ["fake", "real"]:
            # Prior probability
            log_prob = math.log(self.class_counts[c] / total_docs)

            # Likelihood for each word
            for w in words:
                count = self.word_counts[c].get(w, 0)
                prob = (count + 1) / (self.total_words[c] + self.vocab_size)
                log_prob += math.log(prob)

            log_scores[c] = log_prob

        # Normalize with softmax
        max_log = max(log_scores.values())
        exp_scores = {c: math.exp(log_scores[c] - max_log) for c in log_scores}
        total = sum(exp_scores.values())
        probs = {c: exp_scores[c] / total for c in exp_scores}

        predicted = max(probs, key=probs.get)
        return predicted, probs


if __name__ == "__main__":
    # Sample dataset Only
    dataset = [
    ("Breaking: Miracle cure for cancer discovered!", "fake"),
    ("Government announces new education reform", "real"),
    ("Scientists confirm aliens landed in New York", "fake"),
    ("Stock market reaches record high today", "real"),
    ("Celebrity claims to live without eating food", "fake"),
    ("New policy aims to improve healthcare system", "real")
    ]

    # Train the model
    model = NoCapIdentifier()
    model.train_cap_or_no_cap(dataset)

    # Test on new article
    article = """
    Scientists claim they have discovered a miracle cure for cancer.
    According to reports, the treatment works instantly and has no side effects.
    Experts are skeptical about the validity of the research.
    """

    label, probs = model.predict_cap_or_no_cap(article)

    print("Article:", article.strip())
    print("Prediction:", label.upper())
    print(f"Fake: {probs['fake']*100:.2f}% | Real: {probs['real']*100:.2f}%")