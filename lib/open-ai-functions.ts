import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { createClient } from "@supabase/supabase-js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
export const callSplitPdf = async (
  url: string,
  id: string,
  chatbotIdFieldName: string = "chatbotId"
) => {
  const response = await fetch(url);
  const data = await response.blob();
  const loader = new WebPDFLoader(data, {
    parsedItemSeparator: " ",
  });
  const loadedDocs = await loader.load();
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 30,
  });
  return await textSplitter.splitDocuments(loadedDocs).then((res: any[]) =>
    res.map((doc) => {
      doc.metadata = { ...doc.metadata, [chatbotIdFieldName]: id };
      doc.chatbotid = id;
      return doc;
    })
  );
};

// Creating supabase client
export const supabaseClient = createClient(
  process.env.SUPABASE_URL_LC_CHATBOT as string,
  process.env.SUPABASE_API_KEY as string
);
