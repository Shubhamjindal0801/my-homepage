import styled from "@emotion/styled";
import { Button, Menu, Modal, message } from "antd";
import { MenuProps } from "antd/lib";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";
import UpdateBookmark from "./UpdateBookmark";
import AssetUrls from "../common/AssetUrls";
import { Bookmark } from "../common/Interface/Bookmark";

interface Props {
  data: Bookmark;
  user: any;
  index: number;
  fetchBookmarks: () => void;
  onlineStatus: boolean;
}
const Container = styled.div`
  position: relative;
  width: 100px;
  border-radius: 8px;
  background-color: black;
  color: white;
  blur: 2px;
  text-align: center;
  padding: 10px 12px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.4);
  transition: ease-in 0.2s;
  &:hover {
    transform: scale(1.12);
  }
  &:hover Menu {
    opacity: 1;
  }
`;
const MenuIcon = styled.div`
  position: absolute;
  top: 2px;
  right: 4px;
`;
const MenuImage = styled.img`
  position: absolute;
  left: 0;
  width: 15px;
`;
const Menus = styled(Menu)`
  width: 15px;
  height: 15px;
  background-color: transparent;
  opacity: 0;
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
`;

const BookmarkTile = (props: Props) => {
  const { data, user, index, fetchBookmarks, onlineStatus } = props;
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [isOkDelete, setIsOkDelete] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!onlineStatus) {
      message.error("You internet connection is not stable. Please try again");
      return;
    }
    setDeleteModal(true);
    if (isOkDelete) {
      setIsOkDelete(false);
      setDeleteModal(false);
      const q = query(collection(db, `users/${user.uid}/bookmarks`));
      const querySnapshot = await getDocs(q);
      const queryId = querySnapshot.docs[index].id;
      const userRef = collection(db, "users");
      const documentRef = doc(userRef, user.uid, "bookmarks", queryId);
      try {
        await deleteDoc(documentRef);
        message.success(data.title + " successfully deleted");
        fetchBookmarks();
      } catch (error) {
        message.error("Error deleting document:");
      }
    }
  };
  const handleEdit = () => {
    if (!onlineStatus) {
      message.error("You internet connection is not stable. Please try again");
      return;
    }
    setUpdateModal(true);
  };
  const items: MenuProps["items"] = [
    {
      label: <MenuImage src={AssetUrls.THREE_DOT_MENU_ICON} />,
      key: "menu",
      children: [
        {
          type: "group",
          children: [
            {
              label: "Edit",
              key: "edit",
              onClick: () => handleEdit(),
            },
            {
              label: "Delete",
              key: "delete",
              onClick: () => handleDelete(),
            },
          ],
        },
      ],
    },
  ];
  return (
    <>
      <Container>
        {data?.title}
        <MenuIcon>
          <Menus mode="vertical" items={items} />
        </MenuIcon>
      </Container>
      {updateModal && (
        <UpdateBookmark
          data={data}
          user={user}
          updateModal={updateModal}
          setUpdateModal={setUpdateModal}
          fetchBookmarks={fetchBookmarks}
          index={index}
        />
      )}
      {deleteModal && (
        <>
          <Modal
            title={`Are you sure you want to delete ${data?.title} as a bookmark?`}
            open={deleteModal}
            closable={false}
            footer={false}
          >
            <ButtonContainer>
              <Button
                type="primary"
                onClick={() => {
                  setIsOkDelete(true);
                  handleDelete();
                }}
              >
                Yes
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => setDeleteModal(false)}
              >
                No
              </Button>
            </ButtonContainer>
          </Modal>
        </>
      )}
    </>
  );
};

export default BookmarkTile;
