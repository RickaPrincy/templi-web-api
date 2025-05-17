export class GenerateProjectValue {
  name: string;
  value: string;
}

export class GenerateProject {
  scope?: string;
  templateUrl: string;
  repositoryName: string;
  installationId: string;
  isPrivateRepository: boolean;
  values: GenerateProjectValue[];
}
