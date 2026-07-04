import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { note_id, doc_created, table_id, user_table } from "../states/state";
import { createTable, handleDel, user_data } from "../actions/actions";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const SideBar = () => {
  const select_note_id = useSetRecoilState(note_id);
  const [table_changed, set_table_changed] = useState(false);
  const [is_doc_created, set_doc_created] = useRecoilState(doc_created);
  const set_table_id = useSetRecoilState(table_id);
  const [table, setTable] = useRecoilState(user_table);
  const [new_table_name, setNewTable] = useState("");
  const [new_table_content, setNewContent] = useState("");
  const [dialog_state, setDialog] = useState();
  const [err, setErr] = useState("");
  const user = useUser();
  const navigate = useNavigate();
  const [sidebarToggle, setToggle] = useState(true);

  useEffect(() => {
    if (!user.isSignedIn) {
      // navigate('/')
    }
    console.log(table)
    if (user) {
      user_data(user).then((data) => {
        if (data) {
          setTable([...data]);
        }
      });
    }
  }, [is_doc_created, doc_created, table_changed, user_table]);

  return (
    <SidebarProvider>
      <AppSidebar/>
      <main className="w-full flex relative">
        <SidebarTrigger className={"fixed top-3 ml-1 scale-125 z-10"} />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default SideBar;
