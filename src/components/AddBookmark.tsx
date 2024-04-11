import { addDoc, collection } from "@firebase/firestore";
import { Button, Form, Input, Modal, message } from "antd";
import { db } from "../firebase";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";

interface Props {
  user: any;
  bookmarks: any;
  setBookmarks: any;
  fetchBookmarks: any;
  isModalVisible: boolean;
  setIsModalVisible: (val: boolean) => void;
}
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;
const AddUpdateBookmark = (props: Props) => {
  const {
    user,
    bookmarks,
    setBookmarks,
    fetchBookmarks,
    isModalVisible,
    setIsModalVisible,
  } = props;
  const [formRef] = Form.useForm();
  const [title, setTitle] = useState<string>("");
  const createBookmark = async (values: any) => {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user && user.uid}/bookmarks`),
        values
      );
      let newArr = bookmarks;
      newArr.unshift(values);
      setBookmarks(newArr);
      fetchBookmarks();
      message.success("Bookmark added successfully");
      setIsModalVisible(false);
      formRef.resetFields();
    } catch (e: any) {
      console.log(e.message);
      message.error("Couldn't add Bookmark!");
    }
  };
  const handleCancel = () => {
    setIsModalVisible(!isModalVisible);
  };
  return (
    <>
      <Modal
        title="Add Bookmark"
        open={isModalVisible}
        onCancel={handleCancel}
        closable
        footer={false}
      >
        <Form form={formRef} onFinish={createBookmark}>
          <Form.Item
            name="title"
            rules={[
              {
                required: true,
                message: "Title Required!",
              },
            ]}
          >
            <Input
              placeholder="*Enter title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="link"
            rules={[
              {
                required: true,
                message: "URL Required!",
              },
            ]}
          >
            <Input
              type="url"
              placeholder={`*Enter URL ${
                title ? `of ${title}` : "of your favorite website"
              }`}
            />
          </Form.Item>
          <ButtonContainer>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
            <Button type="text" onClick={() => formRef.resetFields()}>
              Reset
            </Button>
          </ButtonContainer>
        </Form>
      </Modal>
    </>
  );
};

export default AddUpdateBookmark;
