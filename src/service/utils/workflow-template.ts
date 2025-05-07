import { Buffer } from 'buffer';

function workflowContent(template): string {
  return `
name: Templi Generate
on:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install templi generate cli
        run: 
      - name: Generate templi model
        run: templi generate -t ${template.url} -o generated -project-name ${template.repoName} -license ${template.license}
`;
}

export function encodedContent(template) {
  return Buffer.from(workflowContent(template)).toString('base64');
}
