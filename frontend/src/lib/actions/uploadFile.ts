"use server";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function uploadFileAction({ formData }: { formData: FormData }) {
  //   if (!(file instanceof File)) {
  //     throw new Error("Invalid file");
  //   }

  // upload to server
  await sleep(1000);
  console.log("uploading", formData);
}
