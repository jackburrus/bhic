import axios from "axios";
import Router from "next/router";
import { useState } from "react";
import {
  Form,
  Input,
  Message,
  Header,
  Segment,
  Container,
} from "semantic-ui-react";

const UploadImage = ({ productId, path, ownerId }) => {
  const [photo, setPhoto] = useState();
  const [values, setValues] = useState({
    errorMessage: null,
    loading: false,
  });

  const { errorMessage, loading } = values;

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("photo", photo);
    formData.append("productId", productId);
    formData.append("ownerId", ownerId);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    setValues({ values, loading: true });

    try {
      const res = await axios.post("/api/photo", formData, config);
    } catch (error) {
      setValues({ values, loading: false, error: "Issue uploading image" });
    }
    setValues({ ...values, loading: false });

    Router.push(path);
  };

  const onChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <Container>
      <Segment>
        <Form onSubmit={onFormSubmit} loading={loading}>
          <Header as="h2">Photo Upload</Header>
          <Form.Field>
            <input type="file" name="myImage" onChange={onChange} />
          </Form.Field>
          <Form.Field>
            <Form.Button
              onClick={onFormSubmit}
              attached="bottom"
              type="submit"
              fluid
              positive
            >
              Upload
            </Form.Button>
          </Form.Field>

          {errorMessage ? <Message negative>{errorMessage}</Message> : ""}
        </Form>
      </Segment>
    </Container>
  );
};

export default UploadImage;
