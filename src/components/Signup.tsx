import { useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, provider } from "../firebase";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import Header from "./Header";
import styled from "@emotion/styled";
import { Button, Form, Input, message } from "antd";
import { v4 as uuidv4 } from "uuid";

interface HelperProps {
  isCursor?: boolean;
}
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;
const SignUpBox = styled.div`
  width: 100%;
  max-width: 350px;
  height: auto;
  box-shadow: var(--shadow);
  border-radius: 1rem;
  padding: 1rem 2rem;
`;
const Heading = styled.h2`
  font-weight: 500;
  font-size: 1.2rem;
  text-align: center;
`;
const OrStatement = styled.p<HelperProps>`
  text-align: center;
  font-size: 0.8rem;
  margin: 10px 0;
  cursor: ${(props) => (props.isCursor ? "pointer" : "default")};
`;
const HitButton = styled(Button)`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;
const Signup = () => {
  const [formRef] = Form.useForm();
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signupWithEmail = (values: any) => {
    const { pass, conPass, email } = values;
    if (pass !== conPass) {
      message.error(`Password doesn't match`);
      setLoading(false);
      return;
    }
    createUserWithEmailAndPassword(auth, email, pass)
      .then(async (userCrenditial) => {
        const user = userCrenditial.user;
        message.success("Account created successfully");
        setLoading(false);
        createDoc(user);
        await addDoc(collection(db, `users/${user.uid}/userDetails`), {
          email: email,
          name: values.name,
          createdAt: new Date(),
        });
        navigate("/landing");
      })
      .catch((error) => {
        const errorMessage = error.message;
        message.error(errorMessage);
        setLoading(false);
      });
  };

  const loginWithEmail = (values: any) => {
    const { email, pass } = values;
    signInWithEmailAndPassword(auth, email, values.password)
      .then(async () => {
        message.success("Successfully logged in");
        setLoading(false);
        navigate("/landing");
      })
      .catch((error) => {
        const errorMessage = error.message;
        message.error(errorMessage);
        setLoading(false);
      });
  };

  const createDoc = async (user: any) => {
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          id: uuidv4(),
          name: user.displayName
            ? user.displayName
            : formRef.getFieldValue("name"),
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        message.success("Doc created");
        setLoading(false);
      } catch (error: any) {
        message.error(error?.message);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const googleAuth = () => {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          const user = result.user;
          createDoc(user);
          navigate("/landing");
          message.success("User Authenticated successfully");
          setLoading(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          message.error(errorMessage);
          setLoading(false);
        });
    } catch (e: any) {
      message.error(e?.message);
      setLoading(false);
    }
  };
  return (
    <Container>
      <Header />
      {login ? (
        <>
          <SignUpBox>
            <Heading>Login</Heading>
            <Form
              style={{
                position: "relative",
              }}
              layout="vertical"
              onFinish={loginWithEmail}
              form={formRef}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input placeholder="johndoe@gmail.com" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input type="password" placeholder="Example123" />
              </Form.Item>
              <HitButton htmlType="submit" type="primary" disabled={loading}>
                {loading ? "Loading..." : "Log in With Email and Password"}
              </HitButton>
              <OrStatement isCursor={false}>or</OrStatement>
              <HitButton type="dashed" onClick={googleAuth}>
                {loading ? "Loading..." : "Log in With Google"}
              </HitButton>
              <OrStatement isCursor={true} onClick={() => setLogin(!login)}>
                Or Don't Have An Account? Click Here
              </OrStatement>
            </Form>
          </SignUpBox>
        </>
      ) : (
        <SignUpBox>
          <Heading>Sign Up</Heading>
          <Form layout="vertical" onFinish={signupWithEmail} form={formRef}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input placeholder="johndoe@gmail.com" />
            </Form.Item>
            <Form.Item
              name="pass"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input type="password" placeholder="Example123" />
            </Form.Item>
            <Form.Item
              name="conPass"
              label="Confirm Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password again!",
                },
              ]}
            >
              <Input type="password" placeholder="Example123" />
            </Form.Item>
            <HitButton htmlType="submit" type="primary" disabled={loading}>
              {loading ? "Loading..." : "Sign Up With Email and Password"}
            </HitButton>
            <OrStatement isCursor={false}>or</OrStatement>
            <HitButton type="dashed" onClick={googleAuth}>
              {loading ? "Loading..." : "Sign Up With Google"}
            </HitButton>
            <OrStatement isCursor={true} onClick={() => setLogin(!login)}>
              Or Have An Account Already? Click Here
            </OrStatement>
          </Form>
        </SignUpBox>
      )}
    </Container>
  );
};

export default Signup;
