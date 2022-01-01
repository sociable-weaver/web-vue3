<template>
  <div v-if="entry.edit === true">
    <div role="working-directory" class="row">
      <label>Working directory</label>
      <input type="text" v-model="edit.workingDirectory" role="working-directory" />
      <div class="tip">The directory from the patch will be applied.</div>
    </div>
    <div role="patch" class="row">
      <label>Patch</label>
      <textarea v-model="editPatch" placeholder="patch" role="patch" />
    </div>
  </div>
  <div v-else>
    <div v-if="workingDirectory" role="workingDirectory" class="workingDirectory">
      Working from: <code>{{ workingDirectory }}</code>
    </div>
    <div class="patch" v-html="patch" />
  </div>
</template>

<script lang="ts">
import { createSaveEntry, Entry, hasChanged, join, OnSaveOutcome, OnSaveResult, SaveEntry } from "@/models/Chapter";
import { Diff2HtmlConfig, html } from "diff2html";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "GitApplyPatch",
  props: {
    entry: Object,
  },
})
export default class GitApplyPatch extends Vue {
  private entry!: Entry;
  private edit: SaveEntry = { parameters: [""] } as SaveEntry;

  mounted(): void {
    this.entry.onSave = this.onSave;
    this.edit = createSaveEntry(this.entry);
  }

  get patch(): string {
    const patch = join(this.entry.parameters);
    return patch.length === 0 ? GitApplyPatch.noPatchMessage() : GitApplyPatch.renderPatch(patch);
  }

  private static noPatchMessage(): string {
    return "<div>No patch information is available</div>";
  }

  private static renderPatch(patch: string): string {
    const config = { drawFileList: false, fileContentToggle: false } as Diff2HtmlConfig;
    return html(patch, config);
  }

  get editPatch(): string {
    return join(this.edit.parameters);
  }

  set editPatch(value: string) {
    this.edit.parameters = value.split("\n");
  }

  private get workingDirectory(): string {
    return this.entry.workingDirectory ? this.entry.workingDirectory : "";
  }

  private onSave(): OnSaveResult {
    const patch = this.editPatch.trim();
    if (patch.length === 0) {
      this.entry.error = "The patch cannot be empty";
      return { outcome: OnSaveOutcome.KeepEditing } as OnSaveResult;
    }

    if (hasChanged(this.entry, this.edit)) {
      return { outcome: OnSaveOutcome.Changed, entry: this.edit } as OnSaveResult;
    }

    return { outcome: OnSaveOutcome.NotChanged } as OnSaveResult;
  }
}
</script>

<style scoped>
div.row {
  padding-top: 15px;
}

textarea {
  width: 99%;
  min-height: 200px;
  font-family: monospace;
  font-size: 1em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.tip {
  font-size: 0.8em;
  font-style: italic;
}

input[type="text"] {
  font-size: 1em;
  font-weight: bold;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0;
  margin-inline-end: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 2px;
  width: 99%;
  color: #2c3e50;
}

label {
  font-size: 1.2em;
}

.patch >>> .d2h-d-none {
  display: none;
}
.patch >>> .d2h-wrapper {
  text-align: left;
}
.patch >>> .d2h-file-header {
  background-color: #f7f7f7;
  border-bottom: 1px solid #d8d8d8;
  font-family: Source Sans Pro, Helvetica Neue, Helvetica, Arial, sans-serif;
  height: 35px;
  padding: 5px 10px;
}
.patch >>> .d2h-file-header,
.patch >>> .d2h-file-stats {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.patch >>> .d2h-file-stats {
  font-size: 14px;
  margin-left: auto;
}
.patch >>> .d2h-lines-added {
  border: 1px solid #b4e2b4;
  border-radius: 5px 0 0 5px;
  color: #399839;
  padding: 2px;
  text-align: right;
  vertical-align: middle;
}
.patch >>> .d2h-lines-deleted {
  border: 1px solid #e9aeae;
  border-radius: 0 5px 5px 0;
  color: #c33;
  margin-left: 1px;
  padding: 2px;
  text-align: left;
  vertical-align: middle;
}
.patch >>> .d2h-file-name-wrapper {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 15px;
  width: 100%;
}
.patch >>> .d2h-file-name {
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.patch >>> .d2h-file-wrapper {
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-bottom: 1em;
}
.patch >>> .d2h-file-collapse {
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
  display: none;
  font-size: 12px;
  justify-content: flex-end;
  padding: 4px 8px;
}
.patch >>> .d2h-file-collapse.patch >>> .d2h-selected {
  background-color: #c8e1ff;
}
.patch >>> .d2h-file-collapse-input {
  margin: 0 4px 0 0;
}
.patch >>> .d2h-diff-table {
  border-collapse: collapse;
  font-family: Menlo, Consolas, monospace;
  font-size: 13px;
  width: 100%;
}
.patch >>> .d2h-files-diff {
  width: 100%;
}
.patch >>> .d2h-file-diff {
  overflow-y: hidden;
}
.patch >>> .d2h-file-side-diff {
  display: inline-block;
  margin-bottom: -8px;
  margin-right: -4px;
  overflow-x: scroll;
  overflow-y: hidden;
  width: 50%;
}
.patch >>> .d2h-code-line {
  padding: 0 8em;
}
.patch >>> .d2h-code-line,
.patch >>> .d2h-code-side-line {
  display: inline-block;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  white-space: nowrap;
  width: 100%;
}
.patch >>> .d2h-code-side-line {
  padding: 0 4.5em;
}
.patch >>> .d2h-code-line-ctn {
  word-wrap: normal;
  background: none;
  display: inline-block;
  padding: 0;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  vertical-align: middle;
  white-space: pre;
  width: 100%;
}
.patch >>> .d2h-code-line del,
.patch >>> .d2h-code-side-line del {
  background-color: #ffb6ba;
}
.patch >>> .d2h-code-line del,
.patch >>> .d2h-code-line ins,
.patch >>> .d2h-code-side-line del,
.patch >>> .d2h-code-side-line ins {
  border-radius: 0.2em;
  display: inline-block;
  margin-top: -1px;
  text-decoration: none;
  vertical-align: middle;
}
.patch >>> .d2h-code-line ins,
.patch >>> .d2h-code-side-line ins {
  background-color: #97f295;
  text-align: left;
}
.patch >>> .d2h-code-line-prefix {
  word-wrap: normal;
  background: none;
  display: inline;
  padding: 0;
  white-space: pre;
}
.patch >>> .line-num1 {
  float: left;
}
.patch >>> .line-num1,
.patch >>> .line-num2 {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0 0.5em;
  text-overflow: ellipsis;
  width: 3.5em;
}
.patch >>> .line-num2 {
  float: right;
}
.patch >>> .d2h-code-linenumber {
  background-color: #fff;
  border: solid #eee;
  border-width: 0 1px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: inline-block;
  position: absolute;
  text-align: right;
  width: 7.5em;
}
.patch >>> .d2h-code-linenumber:after {
  content: "\200b";
}
.patch >>> .d2h-code-side-linenumber {
  background-color: #fff;
  border: solid #eee;
  border-width: 0 1px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  padding: 0 0.5em;
  position: absolute;
  text-align: right;
  text-overflow: ellipsis;
  width: 4em;
}
.patch >>> .d2h-code-side-linenumber:after {
  content: "\200b";
}
.patch >>> .d2h-code-side-emptyplaceholder,
.patch >>> .d2h-emptyplaceholder {
  background-color: #f1f1f1;
  border-color: #e1e1e1;
}
.patch >>> .d2h-code-line-prefix,
.patch >>> .d2h-code-linenumber,
.patch >>> .d2h-code-side-linenumber,
.patch >>> .d2h-emptyplaceholder {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.patch >>> .d2h-code-linenumber,
.patch >>> .d2h-code-side-linenumber {
  direction: rtl;
}
.patch >>> .d2h-del {
  background-color: #fee8e9;
  border-color: #e9aeae;
}
.patch >>> .d2h-ins {
  background-color: #dfd;
  border-color: #b4e2b4;
}
.patch >>> .d2h-info {
  background-color: #f8fafd;
  border-color: #d5e4f2;
  color: rgba(0, 0, 0, 0.3);
}
.patch >>> .d2h-file-diff .patch >>> .d2h-del.patch >>> .d2h-change {
  background-color: #fdf2d0;
}
.patch >>> .d2h-file-diff .patch >>> .d2h-ins.patch >>> .d2h-change {
  background-color: #ded;
}
.patch >>> .d2h-file-list-wrapper {
  margin-bottom: 10px;
}
.patch >>> .d2h-file-list-wrapper a {
  color: #3572b0;
  text-decoration: none;
}
.patch >>> .d2h-file-list-wrapper a:visited {
  color: #3572b0;
}
.patch >>> .d2h-file-list-header {
  text-align: left;
}
.patch >>> .d2h-file-list-title {
  font-weight: 700;
}
.patch >>> .d2h-file-list-line {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  text-align: left;
}
.patch >>> .d2h-file-list {
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;
}
.patch >>> .d2h-file-list > li {
  border-bottom: 1px solid #ddd;
  margin: 0;
  padding: 5px 10px;
}
.patch >>> .d2h-file-list > li:last-child {
  border-bottom: none;
}
.patch >>> .d2h-file-switch {
  cursor: pointer;
  display: none;
  font-size: 10px;
}
.patch >>> .d2h-icon {
  fill: currentColor;
  margin-right: 10px;
  vertical-align: middle;
}
.patch >>> .d2h-deleted {
  color: #c33;
}
.patch >>> .d2h-added {
  color: #399839;
}
.patch >>> .d2h-changed {
  color: #d0b44c;
}
.patch >>> .d2h-moved {
  color: #3572b0;
}
.patch >>> .d2h-tag {
  background-color: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 10px;
  margin-left: 5px;
  padding: 0 2px;
}
.patch >>> .d2h-deleted-tag {
  border: 1px solid #c33;
}
.patch >>> .d2h-added-tag {
  border: 1px solid #399839;
}
.patch >>> .d2h-changed-tag {
  border: 1px solid #d0b44c;
}
.patch >>> .d2h-moved-tag {
  border: 1px solid #3572b0;
}
</style>
