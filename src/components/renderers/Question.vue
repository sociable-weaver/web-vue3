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
  OnSaveOutcome,
  OnSaveResult,
  SaveEntry,
} from "@/models/Chapter";
import { Marked } from "@ts-stack/markdown";
import { Options, Vue } from "vue-class-component";

const QUESTION_PART = "Question";
const ANSWER_PART = "Answer";

interface IndexAndLength {
  index: number;
  length: number;
}

@Options({
  name: "Question",
  props: {
    entry: Object,
  },
})
export default class Question extends Vue {
  private entry!: Entry;
  private edit: SaveEntry = { parameters: Question.defaultQuestion() } as SaveEntry;

  mounted(): void {
    this.entry.onSave = this.onSave;
    this.edit = createSaveEntry(this.entry);

    if (!arrayContainsValues(this.edit.parameters)) {
      this.edit.parameters = [];
    }
  }

  get question(): string {
    const question = join(Question.getQuestionPart(this.entry.parameters));
    return Marked.parse(question);
  }

  get answer(): string {
    const answer = join(Question.getAnswerPart(this.entry.parameters));
    return Marked.parse(answer);
  }

  get editQuestion(): string {
    return join(Question.getQuestionPart(this.edit.parameters));
  }

  set editQuestion(value: string) {
    Question.setQuestionPart(value, this.edit.parameters);
  }

  get editAnswer(): string {
    return join(Question.getAnswerPart(this.edit.parameters));
  }

  set editAnswer(value: string) {
    Question.setAnswerPart(value, this.edit.parameters);
  }

  private onSave(): OnSaveResult {
    const question = join(Question.getQuestionPart(this.edit.parameters));
    if (question.length === 0) {
      this.entry.error = "The question cannot be empty";
      return { outcome: OnSaveOutcome.KeepEditing } as OnSaveResult;
    }

    if (hasChanged(this.entry, this.edit)) {
      return { outcome: OnSaveOutcome.Changed, entry: this.edit } as OnSaveResult;
    }

    return { outcome: OnSaveOutcome.NotChanged } as OnSaveResult;
  }

  private static getQuestionPart(parameters: string[]): string[] {
    return this.getPart(QUESTION_PART, Question.defaultIfNotSet(parameters));
  }

  private static setQuestionPart(value: string, parameters: string[]): void {
    this.setPart(QUESTION_PART, value.split("\n"), parameters);
  }

  private static getAnswerPart(parameters: string[]): string[] {
    return this.getPart(ANSWER_PART, Question.defaultIfNotSet(parameters));
  }

  private static setAnswerPart(value: string, parameters: string[]): void {
    this.setPart(ANSWER_PART, value.split("\n"), parameters);
  }

  private static getPart(name: string, parameters: string[]): string[] {
    const indexAndLength = Question.findPart(name, parameters);
    if (indexAndLength.index != -1) {
      const contentIndex = indexAndLength.index + 1;
      return parameters.slice(contentIndex, contentIndex + indexAndLength.length);
    }

    return [];
  }

  private static setPart(name: string, value: string[], parameters: string[]): void {
    const indexAndLength = Question.findPart(name, parameters);
    if (indexAndLength.index == -1) {
      parameters.push(`${name}:${value.length}`, ...value);
    } else {
      const part = [`${name}:${value.length}`, ...value];
      parameters.splice(indexAndLength.index, indexAndLength.length + 1, ...part);
    }
  }

  private static findPart(name: string, parameters: string[]): IndexAndLength {
    let i = 0;

    while (i < parameters.length) {
      const header = parameters[i];
      const parts = header.split(":");
      const length = parseInt(parts[1]);
      if (name === parts[0]) {
        return { index: i, length };
      }

      i += length + 1;
    }

    return { index: -1, length: -1 };
  }

  private static defaultIfNotSet(parameters: string[]): string[] {
    return arrayContainsValues(parameters) ? parameters : Question.defaultQuestion();
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
