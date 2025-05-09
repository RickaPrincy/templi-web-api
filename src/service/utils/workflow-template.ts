import { Buffer } from 'buffer';

function workflowContent(url, repoName, license): string {
  return `
name: Templi Generate
on:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: archlinux:latest
    steps:
      - uses: actions/checkout@v3

      - name: Update packages
        run: pacman -Syu --noconfirm

      - name: Install Node.js
        run: pacman
        
      - name: Install templi generate cli
        run: yay -Sy templi_cli

      - name: Generate templi model
        run: templi generate -t ${url} -o generated -project-name ${repoName} -license ${license}
`;
}

export function encodedContent(url, repoName, license) {
  return Buffer.from(workflowContent(url, repoName, license)).toString(
    'base64',
  );
}
