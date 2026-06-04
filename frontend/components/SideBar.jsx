import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { note_id, doc_created, table_id, user_table } from "../states/state";
import { createTable, handleDel, user_data } from "../actions/actions";

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
    if (user) {
      user_data(user).then((data) => {
        if (data) {
          setTable([...data]);
        }
      });
    }
  }, [is_doc_created, doc_created, table_changed, user_table]);

  return (
    <div className="flex w-full">
      <div
        className="w-[18%] px-2 py-6 bg-[#EFEDE7] h-screen text-left flex flex-col border-r border-gray-400 relative overflow-hidden"
        style={{ marginLeft: sidebarToggle ? "0%" : "-12.5%", transition: "margin-left 0.3s ease" }}
      >
        <button
          className="cursor-pointer absolute right-3 top-7"
          onClick={() => setToggle(!sidebarToggle)}
        >
          toggel
        </button>
        <h1 className="text-3xl font-semibold text-start ml-3 leading-7 text-black">
          AutoDocs
        </h1>
        <p className="text-sm text-gray-600 ml-3">Writing Space</p>

        <div className="mt-4 px-3 gap-2 flex flex-col">
          <p>Lorem, ipsum.</p>
          <p>Lorem, ipsum.</p>
          <p>Lorem, ipsum.</p>
          <p>Lorem, ipsum.</p>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default SideBar;
