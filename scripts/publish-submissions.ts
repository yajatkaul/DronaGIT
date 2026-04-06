import { readFileSync, existsSync, rmSync, readdirSync } from "fs";
import * as path from "path";

const apiUrl = process.env.API_BASE_URL;
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!apiUrl || !adminUsername || !adminPassword) {
  console.error(
    "Missing API_BASE_URL, ADMIN_USERNAME, or ADMIN_PASSWORD environment variables!",
  );
  process.exit(1);
}

async function main() {
  const metadataPath = process.argv[2];
  if (!metadataPath) {
    console.error("Please provide the path to the metadata.json file.");
    process.exit(1);
  }

  const absoluteMetadataPath = path.resolve(metadataPath);
  if (!existsSync(absoluteMetadataPath)) {
    console.error(`Metadata file not found: ${absoluteMetadataPath}`);
    process.exit(1);
  }

  const dirPath = path.dirname(absoluteMetadataPath);
  console.log(`Processing submission in: ${dirPath}`);

  let metadata: any;
  try {
    metadata = JSON.parse(readFileSync(absoluteMetadataPath, "utf8"));
  } catch (error) {
    console.error("Failed to parse metadata.json:", error);
    process.exit(1);
  }

  const requiredFields = ["type", "title", "branch", "semester"];
  for (const field of requiredFields) {
    if (!metadata[field]) {
      console.error(`Missing required field in metadata: ${field}`);
      process.exit(1);
    }
  }

  const categoryName = metadata.type.toLowerCase();
  const validCategories = ["notes", "papers", "syllabus", "practicals"];

  if (!validCategories.includes(categoryName)) {
    console.error(
      `Invalid category type: ${categoryName}. Must be one of: ${validCategories.join(", ")}`,
    );
    process.exit(1);
  }

  if (categoryName !== "syllabus" && !metadata.subject) {
    console.error(
      `Missing required field in metadata: subject (required for category: ${categoryName})`,
    );
    process.exit(1);
  }

  if (categoryName === "papers") {
    if (!metadata.year) {
      console.error(`Missing 'year' field in metadata (required for papers).`);
      process.exit(1);
    }
    const validPaperTypes = [
      "Sessional",
      "University",
      "Pre University",
      "Other",
    ];
    if (metadata.paperType && !validPaperTypes.includes(metadata.paperType)) {
      console.error(
        `Invalid 'paperType' in metadata. Must be one of: ${validPaperTypes.join(", ")}`,
      );
      process.exit(1);
    }
  }

  const filesInDir = readdirSync(dirPath);
  const pdfFileName = filesInDir.find((f) => f.toLowerCase().endsWith(".pdf"));

  if (!pdfFileName) {
    console.error("No PDF file found in the submission directory.");
    process.exit(1);
  }

  const pdfFilePath = path.join(dirPath, pdfFileName);

  try {
    console.log(`Authenticating as ${adminUsername}...`);
    const safeApiUrl = apiUrl as string;
    const baseUrl = safeApiUrl.endsWith("/")
      ? safeApiUrl.slice(0, -1)
      : safeApiUrl;

    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: adminUsername,
        password: adminPassword,
      }),
    });

    if (!loginRes.ok) {
      throw new Error(`Login failed: ${await loginRes.text()}`);
    }

    const setCookieHeader = loginRes.headers.get("set-cookie");
    if (!setCookieHeader) {
      throw new Error("No set-cookie header returned from login");
    }

    const authCookie = setCookieHeader.split(";")[0];

    console.log(`Preparing upload for ${pdfFileName}...`);

    const form = new FormData();
    form.append("title", metadata.title);
    form.append("branch", metadata.branch);
    form.append("semester", metadata.semester);
    form.append("category", categoryName);

    form.append("subject", metadata.subject || "");

    if (categoryName === "papers") {
      form.append("type", metadata.paperType || "University");
      form.append("year", metadata.year);
    }

    const fileBuffer = readFileSync(pdfFilePath);
    const blob = new Blob([fileBuffer], { type: "application/pdf" });
    form.append("file", blob, pdfFileName);

    console.log(`Uploading to ${baseUrl}/api/admin/upload...`);
    const uploadRes = await fetch(`${baseUrl}/api/admin/upload`, {
      method: "POST",
      headers: {
        Cookie: authCookie,
      },
      body: form,
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${await uploadRes.text()}`);
    }

    const jsonRes = await uploadRes.json();
    console.log(`Successfully uploaded and created record ID:`, jsonRes._id);

    console.log(`Cleaning up submission directory: ${dirPath}...`);
    rmSync(dirPath, { recursive: true, force: true });
    console.log(`Cleaned up ${dirPath}.`);
  } catch (error) {
    console.error("Failed to process submission:", error);
    process.exit(1);
  }
}

main();
