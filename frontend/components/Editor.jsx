import React, { useEffect, useState } from "react";
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  ConditionalContents,
  InsertCodeBlock,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  toolbarPlugin,
  UndoRedo,
  headingsPlugin,
  Button,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { note_id, doc_created, table_id, user_table } from "../states/state";
import { useClerk, useUser } from "@clerk/clerk-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

const Editor = () => {
  const { signOut } = useClerk();
  const [publish, setPublish] = useState(false);
  const [select, setSelect] = useState("medium");
  const [subtitle, setSubTitle] = useState("");
  const [hashnodePublicationId, setPublicationId] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState();
  const [token, setToken] = useState({
    medium: "",
    hashnode: "",
    "dev-to": "",
    x: "",
  });
  const underline = {
    medium: [
      "w-20 left-[30px]",
      "go to medium.com > setting > Security and apps > Integration token",
      "445px",
    ],
    "dev-to": [
      "w-8 left-[148px]",
      "go to https://dev.to/settings/extensions > Generate API Key",
      "445px",
    ],
    hashnode: [
      "w-8 left-[228px] mt-1",
      "go to hashnode.com > settings > developer and generate an auth-token. We'll also require a publicationId, for that go to hashnode.com > settings > blogs > blog dashboard/setting icon > copy the id from the url hashnode.com/{publicationId}/dashboard",
      "560px",
    ],
    x: ["w-10 left-[304px] mt-1", "", "430px"],
  };
  const [saveLoading, setSaveLoading] = useState(false);
  const [tableId, setTableId] = useRecoilState(table_id);
  const set_created_doc = useSetRecoilState(doc_created);
  const [table, setTable] = useRecoilState(user_table);
  const [markdown, setMarkdown] = useState(
    "# **Welcome, Please select/create a table**",
  );
  const [key, setKey] = useState(true);
  const user = useUser();
  const select_note_id = useRecoilValue(note_id);
  const select_note = useSetRecoilState(note_id);
  const [errors, setErrors] = useState({
    hashnode: "",
    ["dev-to"]: "",
    medium: "",
  });

  const delete_note = async (id) => {
    if (!id) {
      alert("Please select the doc to delete");
    }
    try {
      const req = await fetch(
        `${import.meta.env.VITE_PORT}/docs/delete-doc/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const res = await req.json();
      if (res.message == "success") {
        const new_tables = table.map((x) => {
          const key = Object.keys(x)[0];
          let docs = x[Object.keys(x)[0]];
          if (Object.keys(docs).length == 1) {
            const table_id = docs[0].table_id;
            docs = docs.filter((x) => x.id != res.id);
            return { [key]: [{ table_id }] };
          }
          docs = docs.filter((x) => x.id != res.id);
          return { [key]: docs };
        });
        select_note(new_tables[0][Object.keys(new_tables[0])][0]?.id | null);
        setTable(new_tables);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const note_content = async () => {
    if (tableId && select_note_id == "") {
      setMarkdown(" ");
      setKey((p) => !p);
    } else {
      console.log(select_note_id);
      const req = await fetch(`${import.meta.env.VITE_PORT}/docs/get-docs-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note_id: select_note_id }),
      });

      const note = await req.json();
      if (note.message == "success") {
        setMarkdown(note.docs.content);
        setKey((p) => !p);
      }
    }
  };

  useEffect(() => {
    if (select_note_id || tableId) {
      note_content();
    }
    if (user.user?.id) {
      getToken();
    }
  }, [select_note_id, tableId]);

  const save_docs = async () => {
    const name = document.getElementById("doc_name").value;
    if (!name && !select_note_id) {
      return alert("Please enter a name for the docs");
    }
    if (!tableId && !select_note_id) {
      return alert(
        "Please select the table in which you would to create the docs",
      );
    }
    if (tableId || select_note_id) {
      try {
        const req = await fetch(
          `${import.meta.env.VITE_PORT}/docs/create-docs`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              note_id: select_note_id | null,
              table_id: tableId | null,
              user_id: user.user.id,
              content: markdown,
              publish: false,
            }),
          },
        );

        const response = await req.json();
        select_note(response.docs.id);
        setTable((p) => [...p, response.docs]);
        setTableId(false);
        set_created_doc((p) => !p);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getToken = async () => {
    try {
      const req = await fetch(`${import.meta.env.VITE_PORT}/user/get-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          id: user.user.id,
        },
      });
      const res = await req.json();
      if (req.status == 200) {
        setToken(res.token.tokens);
        setPublicationId(res.token.hashnodepubId);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const postBlog = async () => {
    if (
      token["dev-to"] == "" &&
      token.hashnode == "" &&
      token.medium == "" &&
      token.x == ""
    ) {
      alert("please enter a auth-token for any of the platform mentioned");
      return;
    }
    if (token.hashnode != "" && hashnodePublicationId == "") {
      alert("Please enter the publicationId to post on hashnode");
    }
    const platform = [];
    Array.from(Object.keys(token)).map((x) => {
      if (token[x] != "") {
        platform.push(x);
      }
    });
    try {
      const mediumDetailsReq = await fetch(
        `${import.meta.env.VITE_PORT}/user/medium-user-data`,
        {
          method: "GET",
          headers: {
            token: `${token.medium}`,
          },
        },
      );
      const mediumDetailsRes = await mediumDetailsReq.json();
      if (
        platform.includes("medium") &&
        (!title || !markdown || !token.medium || !mediumDetailsRes.id)
      ) {
        alert("Please provide the mentioned details");
        return;
      }
      if (
        platform.includes("dev-to") &&
        (!title || !markdown || !token["dev-to"])
      ) {
        alert("Please provide the mentioned details");
        return;
      }
      if (
        platform.includes("hashnode") &&
        (!title ||
          !subtitle ||
          !markdown ||
          token.hashnode == "" ||
          !hashnodePublicationId)
      ) {
        if (subtitle.length < 6) {
          alert("subtitle must be of 6 letters");
          return;
        }
        alert("Please provide the mentioned details");
        return;
      }
      const req = await fetch(`${import.meta.env.VITE_PORT}/blog/post-blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: JSON.stringify(token),
          mediumuserid: mediumDetailsRes.id,
          hashnodePublicationId,
          platforms: platform,
        },
        body: JSON.stringify({
          title: title,
          subtitle,
          tags: tags.medium,
          content: markdown,
        }),
      });
      const postedBlog = (await req.json()).posted;
      console.log(postedBlog);
      const errPlatforms = Object.keys(postedBlog).map((x) => {
        if (postedBlog[x].error || postedBlog[x].errors) {
          return x;
        }
      });
      if (errPlatforms) {
        console.log(errPlatforms);
        alert(
          `Oops, The post failed to publish on ${errPlatforms.map((x) => {
            if (x != undefined) {
              return x;
            }
          })}`,
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteToken = async () => {
    token[select] = "";
    try {
      const id = user.user.id;
      const req = await fetch(`${import.meta.env.VITE_PORT}/user/add-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          tokens: token,
          hashnodepubId: hashnodePublicationId,
        }),
      });
      const res = await req.json();
      if (req.status == 200) {
        setToken(res.userTokens.tokens);
        setPublicationId(res.userTokens.hashnodepubId);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const saveToken = async () => {
    setSaveLoading(true);
    try {
      const id = user.user.id;
      const req = await fetch(`${import.meta.env.VITE_PORT}/user/add-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          tokens: token,
          hashnodepubId: hashnodePublicationId,
        }),
      });
      const res = await req.json();
      if (req.status == 200) {
        setToken(res.userTokens.tokens);
        setPublicationId(res.userTokens.hashnodepubId);
      }
    } catch (error) {
      console.log(error.message);
    }
    setSaveLoading(false);
  };

  return (
    <div className="w-full bg-[#FCF9F4] overflow-y-auto">
      <div className="w-full flex justify-between items-center text-center px-6 py-2 text-black border-b border-[#A0A8B1]">
        <h1 className="border-0 border-b-2 w-fit md:text-lg border-gray-400">
          Blog 1
        </h1>
        <span className="flex gap-3">
          <button className="border border-black hover:bg-[#C1C7CD] px-3 py-1.5 rounded-md font-medium cursor-pointer">
            New Docs
          </button>
          <button className="bg-[#CE9C4D] hover:bg-[#C28C35] cursor-pointer text-black rounded-md px-3 py-1.5 font-medium">
            Logout
          </button>
        </span>
      </div>
      {markdown && (
        <div className="w-full h-fit mt-0">
          <SimpleEditor />
        </div>
      )}
    </div>
  );
};

export default Editor;

