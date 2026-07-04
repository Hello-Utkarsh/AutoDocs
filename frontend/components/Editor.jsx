import React, { useEffect, useState } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import "@mdxeditor/editor/style.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { note_id, doc_created, table_id, user_table } from "../states/state";
import { SignOutButton, useClerk, useUser } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";


const Editor = () => {
  const { signOut } = useClerk();
  const [publish, setPublish] = useState(false);
  const [select, setSelect] = useState("medium");
  const [subtitle, setSubTitle] = useState("");
  const [hashnodePublicationId, setPublicationId] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState();
  const frameworks = ["None"]
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
  const [newTable, setNewTable] = useState(false)
  const [key, setKey] = useState(true);
  const user = useUser();
  const select_note_id = useRecoilValue(note_id);
  const select_note = useSetRecoilState(note_id);
  const [newNoteData, seNewNoteData] = useState({ name: "", description: "", table: "" })
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      table: formData.get("table"),
      newTable,
    };

    console.log(data);
  };

  return (
    <div className="w-full bg-[#FCF9F4] overflow-y-auto">
      <div className="w-full flex justify-between items-center text-center pr-6 pl-10 py-2 text-black border-b border-[#A0A8B1]">
        <h1 className="border-0 border-b-2 w-fit md:text-lg border-gray-400">
          Blog 1
        </h1>
        <span className="flex gap-3">
          <Dialog>
            <DialogTrigger>
              <button className="border border-black hover:bg-[#C1C7CD] px-3 py-1.5 rounded-md font-medium cursor-pointer">
                New Docs
              </button>
            </DialogTrigger>
            <DialogContent>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mt-4"
              >
                <DialogTitle className="font-semibold text-lg">Let's make a new one</DialogTitle>
                <DialogHeader className="flex flex-col gap-2 mt-2">
                  <span className="flex flex-col gap-2">
                    <Label>What are we writing today</Label>
                    <Input
                      id="title"
                      name="title"
                      required />
                  </span>
                  <span className="flex flex-col gap-2">
                    <Label>What is this about??</Label>
                    <Input
                      id="description"
                      name="description"
                    />
                  </span>
                  <span className="flex justify-between items-center">
                    <Label>Where should this go? </Label>
                    <Combobox items={frameworks}>
                      <ComboboxInput
                        id="table"
                        name="table"
                        className="w-38"
                        placeholder="Select a table"
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item} value={item}>
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </span>
                  <span className="flex gap-2">
                    <Checkbox
                      id="newTable"
                      checked={newTable}
                      onCheckedChange={setNewTable}
                    />
                    <Label htmlFor="terms-checkbox">Create New Table</Label>
                  </span>
                  <Input type='submit' value='Submit' className="bg-[#CE9C4D] hover:bg-[#C28C35] py-1.5 w-full rounded-xl mt-2" />
                </DialogHeader>
              </form>
            </DialogContent>
          </Dialog>

          <button className="bg-[#CE9C4D] hover:bg-[#C28C35] items-center gap-2 cursor-pointer flex text-black rounded-md px-3 py-1.5 font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              color="currentColor"
              fill="none"
            >
              <path
                d="M20.9961 16.25C21.4103 16.25 21.7461 16.5858 21.7461 17C21.7461 17.8817 21.7524 18.4698 21.6182 18.9707C21.2714 20.2647 20.2608 21.2753 18.9668 21.6221C18.5911 21.7227 18.1663 21.7445 17.6055 21.749L16.9961 21.75H6.99614C6.11448 21.75 5.52634 21.7563 5.02544 21.6221C3.73149 21.2753 2.72084 20.2647 2.37407 18.9707C2.23985 18.4698 2.24614 17.8817 2.24614 17C2.24614 16.5858 2.58195 16.25 2.99614 16.25C3.41035 16.25 3.74614 16.5858 3.74614 17C3.74614 17.978 3.75311 18.32 3.82329 18.582C4.03134 19.3585 4.63767 19.9648 5.41411 20.1729C5.67617 20.243 6.01813 20.25 6.99614 20.25H16.9961C17.9741 20.25 18.3161 20.243 18.5781 20.1729C19.3546 19.9648 19.9609 19.3585 20.169 18.582C20.2391 18.32 20.2461 17.978 20.2461 17C20.2461 16.5858 20.5819 16.25 20.9961 16.25ZM12.1289 2.25684C12.4334 2.28916 12.7094 2.42563 12.917 2.55078C13.175 2.70635 13.4403 2.91444 13.6963 3.14062C14.2101 3.59462 14.7605 4.18614 15.2568 4.75781C15.7564 5.33317 16.2167 5.9069 16.5508 6.33496C16.7181 6.54935 16.8553 6.7288 16.9502 6.85449C16.9974 6.91702 17.0342 6.96688 17.0596 7.00098C17.0722 7.01797 17.0822 7.03197 17.0889 7.04102C17.092 7.0452 17.0949 7.04841 17.0967 7.05078C17.0974 7.05175 17.0982 7.05311 17.0986 7.05371L17.0996 7.05469C17.3449 7.38811 17.2736 7.8579 16.9404 8.10352C16.607 8.34901 16.1382 8.27766 15.8926 7.94434L15.8906 7.94238C15.8893 7.94053 15.8867 7.93746 15.8838 7.93359C15.8779 7.92568 15.8692 7.91325 15.8574 7.89746C15.8338 7.86576 15.7983 7.81881 15.7529 7.75879C15.6621 7.63847 15.53 7.46513 15.3682 7.25781C15.0439 6.84232 14.6008 6.29035 14.124 5.74121C13.6598 5.20656 13.1761 4.69039 12.7461 4.30469V16C12.7461 16.4141 12.4101 16.7498 11.9961 16.75C11.5819 16.75 11.2461 16.4142 11.2461 16V4.30469C10.816 4.69049 10.3326 5.20733 9.86821 5.74219C9.39146 6.29129 8.94834 6.84231 8.62407 7.25781C8.4623 7.46511 8.33021 7.63844 8.2393 7.75879C8.19399 7.81878 8.15847 7.86573 8.13481 7.89746C8.12307 7.91321 8.11433 7.92564 8.10844 7.93359C8.1056 7.93743 8.10302 7.94049 8.10161 7.94238L8.10063 7.94434C7.85508 8.27775 7.38531 8.34885 7.0518 8.10352C6.71831 7.85791 6.64707 7.38918 6.89262 7.05566L6.8936 7.05371C6.89407 7.05303 6.89489 7.05168 6.89555 7.05078C6.89734 7.0484 6.90028 7.04519 6.90337 7.04102C6.91009 7.03193 6.92002 7.01794 6.93266 7.00098C6.9581 6.96685 6.99484 6.91699 7.04204 6.85449C7.13697 6.72881 7.27423 6.55022 7.44145 6.33594C7.77557 5.9078 8.23572 5.33333 8.7354 4.75781C9.23178 4.18613 9.78217 3.59459 10.2959 3.14062C10.5519 2.91444 10.8172 2.70632 11.0752 2.55078C11.3127 2.40767 11.6393 2.25 11.9961 2.25L12.1289 2.25684Z"
                fill="currentColor"
              ></path>
            </svg>
            Publish
          </button>
          <SignOutButton>
            <button onClick={signOut} className="bg-[#CE9C4D] hover:bg-[#C28C35] cursor-pointer text-black rounded-md px-3 py-1.5 font-medium">
              Logout
            </button>
          </SignOutButton>
        </span>
      </div>
      {
        markdown && (
          <div className="w-full h-fit mt-0">
            <SimpleEditor value />
          </div>
        )
      }
    </div >
  );
};

export default Editor;
