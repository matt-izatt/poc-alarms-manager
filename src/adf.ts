class ADFHardBreak {
  public type = "hardBreak";
}

class ADFText {
  public type = "text";

  constructor(public text: string) {}
}

export class ADFParagraph {
  public type = "paragraph";
  public content: ADFInline[] = [];

  constructor(content: string[]) {
    content.forEach((line) => {
      this.content.push(...[new ADFText(line), new ADFHardBreak()]);
    });
  }
}

export class ADFHeading {
  public type = "heading";
  public content: ADFText[] = [];
  public attrs = {
    level: 3,
  };

  constructor(text: string, level: number) {
    this.content.push(new ADFText(text));
    this.attrs.level = level;
  }
}

export class ADFCodeBlock {
  public type = "codeBlock";
  public content: ADFText[] = [];
  public attrs = {
    language: "json",
  };

  constructor(content: string) {
    this.content.push(new ADFText(content));
  }
}

type ADFInline = ADFHardBreak | ADFText;

export type ADF =
  | ADFHardBreak
  | ADFText
  | ADFParagraph
  | ADFHeading
  | ADFCodeBlock;
