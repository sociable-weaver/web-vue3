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
  <div v-else>
    <div role="question" class="question" v-html="question" />
    <div role="answer" class="answer" v-html="answer" />
  </div>
</template>

<script lang="ts">
import {
  arrayContainsValues,
  createSaveEntry,
  Entry,
  join,
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
  private edit: SaveEntry = { parameters: Question.defaultQuestion() } as SaveEntry;

  mounted(): void {
    this.entry.onSave = this.onSave;
    this.edit = createSaveEntry(this.entry);
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
    const question = join(Question.getQuestionPart(this.edit.parameters));
    return Marked.parse(question);
  }

  set editQuestion(value: string) {
    console.log("Question", value);
  }

  get editAnswer(): string {
    const answer = join(Question.getAnswerPart(this.edit.parameters));
    return Marked.parse(answer);
  }

  set editAnswer(value: string) {
    console.log("Answer", value);
  }

  private onSave(): OnSaveResult {
    this.entry.error = "";
    return { outcome: OnSaveOutcome.NotChanged } as OnSaveResult;
  }

  private static getQuestionPart(parameters: string[]): string[] {
    return this.getPart(QUESTION_PART, Question.defaultIfNotSet(parameters));
  }

  private static getAnswerPart(parameters: string[]): string[] {
    return this.getPart(ANSWER_PART, Question.defaultIfNotSet(parameters));
  }

  private static getPart(name: string, parameters: string[]): string[] {
    let i = 0;

    while (i < parameters.length) {
      const header = parameters[i];
      const parts = header.split(":");
      const length = parseInt(parts[1]);
      if (name === parts[i]) {
        return parameters.slice(i + 1, i + 1 + length);
      }

      i += length;
    }

    return [];
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
