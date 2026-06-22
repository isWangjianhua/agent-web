export type Artifact = {
  id: string;
  name: string;
  status: "ready" | "uploading" | "pending";
  objectKey?: string;
  contentType?: string;
};

