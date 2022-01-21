export default {
  status: 200,
  data: {
    title: "Test title",
    description: "Test description",
    bookPath: "path-to-book",
    chapters: [
      {
        chapterPath: "chapter-1",
        entries: [
          {
            type: "chapter",
            id: "dffccbca-4089-4ce2-aa04-a01249620dba",
            parameters: ["Title:1", "Chapter 1", "Description:2", "Test chapter 1"],
          },
        ],
      },
      {
        chapterPath: "chapter-2",
        entries: [
          {
            type: "chapter",
            id: "5eb44934-fe09-416c-9571-d188bae04c89",
            parameters: ["Title:1", "Chapter 2", "Description:2", "Test chapter 2"],
          },
        ],
      },
    ],
  },
};
