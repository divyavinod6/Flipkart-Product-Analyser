import spacy
from spacy.lang.en.stop_words import STOP_WORDS
from string import punctuation
from heapq import nlargest

class TextSummarizer:
    def __init__(self):
        self.stopwords = list(STOP_WORDS)
        self.nlp = spacy.load('en_core_web_sm')

    def preprocess_text(self, text):
        doc = self.nlp(text)
        tokens = [token for token in doc]  # Store Spacy tokens, not text strings
        return tokens

    def calculate_word_frequencies(self, tokens):
        word_frequencies = {}
        for token in tokens:  # Iterate through Spacy tokens
            if token.text.lower() not in self.stopwords and token.text.lower() not in punctuation:
                if token.text not in word_frequencies.keys():
                    word_frequencies[token.text] = 1
                else:
                    word_frequencies[token.text] += 1
        return word_frequencies

    def summarize_text(self, text, ratio=0.3):
        tokens = self.preprocess_text(text)
        word_frequencies = self.calculate_word_frequencies(tokens)

        max_frequency = max(word_frequencies.values())

        for word in word_frequencies.keys():
            word_frequencies[word] = word_frequencies[word] / max_frequency

        sentence_tokens = [sent for sent in self.nlp(text).sents]
        sentence_scores = {}

        for sent in sentence_tokens:
            for token in sent:  # Iterate through Spacy tokens
                if token.text.lower() in word_frequencies.keys() and token.text.lower() not in punctuation:
                    if sent not in sentence_scores.keys():
                        sentence_scores[sent] = word_frequencies[token.text.lower()]
                    else:
                        sentence_scores[sent] += word_frequencies[token.text.lower()]

        select_length = int(len(sentence_tokens) * ratio)
        summary = nlargest(select_length, sentence_scores, key=sentence_scores.get)
        final_summary = [sent.text for sent in summary]  # Use sent.text to get the text of a sentence
        summary = ' '.join(final_summary)

        return summary

# Example usage:
if __name__ == "__main__":
    summarizer = TextSummarizer()
    text = "Best chocolate A1 delivery Very bad product Good Nice product  everyone liked it thank you flipcart Good Bad Nice Super Best Arsh love Priya Melting chocolate   Love it Delicious  Will order again Wow Good Price high Ilove it Best Nice Good Good product Goog Good nice Thank you Good   Nice Super iteam Good Yummy   Good   Wow   Waste product Please don t buy this product Good products Worth it   Good Good Really awesome product Yummmmmy I like it Very good good super Best Just wow   Bad quality Thank you   Very good quality and the taste is awesome  Love to order it again Average Nice Good Good Leakage Yummy   Good I love it Happy with silk purchase  I got this in best condition Seller gives this choclate with ice pack for better condition of chocolates Good very good Good geniune  long Expiry date  Nice Thats a multipurpose chocklet"
    summary = summarizer.summarize_text(text)
    print(summary)

#  Melting chocolate   Love it Delicious  Will order again Wow Good Price high Ilove it Best Nice Good Good product Goog Good nice Thank you Good   Nice Super iteam Good Yummy   Good Good Good Really awesome product Yummmmmy I like it Very good good super Best Just wow   Bad quality Thank you   Very good quality and the taste is awesome