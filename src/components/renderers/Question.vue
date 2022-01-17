<template>
  <div v-if="entry.edit === true">
    <div role="question" class="row">
      <label>Question</label>
      <textarea v-model="editQuestion" placeholder="Question (Markdown)" />
    </div>
    <div role="answer" class="row">
      <label>Answer</label>
      <textarea v-model="editAnswer" placeholder="Answer (Markdown)" />
    </div>
  </div>
  <div v-else class="q-and-a">
    <div role="question" class="question markdown" v-html="question" />
    <div role="answer" class="answer markdown" v-html="answer" />
  </div>
</template>

<script lang="ts">
import {
  arrayContainsValues,
  createSaveEntry,
  Entry,
  hasChanged,
  join,
  MultipartParameters,
  OnSaveOutcome,
  OnSaveResult,
  SaveEntry,
} from "@/models/Chapter";
import { Marked } from "@ts-stack/markdown";
import { Options, Vue } from "vue-class-component";

const QUESTION_PART = "Question";
const ANSWER_PART = "Answer";

@Options({
  name: "Question",
  props: {
    entry: Object,
  },
})
export default class Question extends Vue {
  private entry!: Entry;
  private edit: SaveEntry = {} as SaveEntry;

  private readQa: MultipartParameters = new MultipartParameters(Question.defaultQuestion());
  private editQa: MultipartParameters = new MultipartParameters([]);

  mounted(): void {
    this.entry.onSave = this.onSave;
    this.edit = createSaveEntry(this.entry);

    if (arrayContainsValues(this.edit.parameters)) {
      this.readQa = new MultipartParameters(this.entry.parameters);
    } else {
      this.edit.parameters = [];
    }

    this.editQa = new MultipartParameters(this.edit.parameters);
  }

  get question(): string {
    const question = join(Question.getQuestionPart(this.readQa));
    return Marked.parse(question);
  }

  get answer(): string {
    const answer = join(Question.getAnswerPart(this.readQa));
    return Marked.parse(answer);
  }

  get editQuestion(): string {
    return join(Question.getQuestionPart(this.editQa));
  }

  set editQuestion(value: string) {
    this.setQuestionPart(value);
  }

  get editAnswer(): string {
    return join(Question.getAnswerPart(this.editQa));
  }

  set editAnswer(value: string) {
    this.setAnswerPart(value);
  }

  private onSave(): OnSaveResult {
    const question = join(Question.getQuestionPart(this.editQa));
    if (question.length === 0) {
      this.entry.error = "The question cannot be empty";
      return { outcome: OnSaveOutcome.KeepEditing } as OnSaveResult;
    }

    if (hasChanged(this.entry, this.edit)) {
      return { outcome: OnSaveOutcome.Changed, entry: this.edit } as OnSaveResult;
    }

    return { outcome: OnSaveOutcome.NotChanged } as OnSaveResult;
  }

  private static getQuestionPart(parameters: MultipartParameters): string[] {
    return parameters.getPart(QUESTION_PART);
  }

  private setQuestionPart(value: string): void {
    this.editQa.setPart(QUESTION_PART, value.split("\n"));
  }

  private static getAnswerPart(parameters: MultipartParameters): string[] {
    return parameters.getPart(ANSWER_PART);
  }

  private setAnswerPart(value: string): void {
    this.editQa.setPart(ANSWER_PART, value.split("\n"));
  }

  private static defaultQuestion(): string[] {
    return [`${QUESTION_PART}:1`, "What's on your mind?", `${ANSWER_PART}:0`];
  }
}
</script>

<style scoped>
.q-and-a {
  border-left: #2c3e50 5px solid;
  padding: 1px 10px;
  background-color: whitesmoke;
}

.question {
  font-size: 1.1em;
  font-weight: bold;
}

.markdown >>> pre {
  padding: 5px;
  border: 1px solid black;
  border-radius: 2px;
  background-color: lightgrey;
  color: black;
  white-space: pre-wrap;
}

.markdown >>> pre code {
  border: 0;
  padding: 0;
  margin: 0;
}

.markdown >>> code {
  padding: 2px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  background-color: lightgrey;
  color: black;
}

.markdown >>> a code {
  color: -webkit-link;
}

.markdown >>> blockquote {
  font-style: italic;
}

.markdown >>> blockquote p {
  quotes: initial;
}

.markdown >>> blockquote p::before {
  content: open-quote;
}

.markdown >>> blockquote p::after {
  content: close-quote;
}

div.row {
  padding-top: 15px;
}

textarea {
  width: 100%;
  min-height: 400px;
  font-family: Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono,
    Courier New, monospace;
  font-size: 1em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

label {
  font-size: 1.2em;
}
</style>
