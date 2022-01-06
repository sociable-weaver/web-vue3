<template>
  <div class="about">
    <h2>Prime Directive</h2>
    <blockquote cite="https://www.thoughtworks.com/en-de/insights/blog/applying-prime-directive-beyond-retrospective">
      <p>
      Regardless of what we discover, we understand and truly believe that everyone did the best job they could, given
      what they knew at the time, their skills and abilities, the resources available, and the situation at hand.
      </p>
    </blockquote>
    <p>Norm Kerth<br />Project Retrospectives: A Handbook for Team Review</p>
    <h2>Sociable Weaver</h2>
    <p>
      As an author of programming blogs, or books, it is hard to make sure that the examples provided in the text work
      well. As a reader, it is frustrating to find halfway through that the example does not work or how some things
      ended up here and not there.
    </p>
    <p>Sociable Weaver is a platform created to solve these problems.</p>
    <ul>
      <li>
        <strong>For the authors</strong> - blogs or books Sociable Weaver provides a testing platform where all examples
        can be executed to make sure that these work and produce the expected results.
      </li>
      <li>
        <strong>For the readers</strong> - Sociable Weaver provides an interactive platform where all examples can be
        executed through the interactive web interface and viewed locally using the preferred IDE.
      </li>
    </ul>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
blockquote {
  margin-left: 0;
  font-style: italic;
  quotes: initial;
}

blockquote p::before {
  content: open-quote;
}

blockquote p::after {
  content: close-quote;
}
</style>
