from model import NaiveBayesCapIdentifier
import os


if __name__ == "__main__":
    TRAIN_FILE = "./data/final_en.csv"
    NEW_ARTICLES = "./data/news.csv"
    MODEL_FILE = "./data/nb_full_model.pkl"

    # Load model if exists, else train and save
    if os.path.exists(MODEL_FILE):
        nb = NaiveBayesCapIdentifier.load_model(MODEL_FILE)
    else:
        nb = NaiveBayesCapIdentifier()
        test_set = nb.train(TRAIN_FILE, test_ratio=0.2)
        acc = sum(nb.predict(doc)[0] == lbl for doc, lbl in test_set) / len(test_set)
        print(f"Validation Accuracy: {acc:.2%}")
        nb.save_model(MODEL_FILE)

    nb.classify_and_append(NEW_ARTICLES, TRAIN_FILE, debug=True)


    # * Source Data Sets file:  https://www.kaggle.com/datasets/evilspirit05/english-fake-news-dataset?select = final_en.csv