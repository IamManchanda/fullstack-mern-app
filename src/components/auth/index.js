/* eslint-disable react/jsx-pascal-case */
import React, { Fragment, useContext } from "react";
import { withRouter } from "react-router-dom";

import Shared_Card from "../shared/card";
import Shared_FormInput from "../shared/form-input";
import Shared_Button from "../shared/button";
import Shared_ErrorModal from "../shared/error-modal";
import Shared_LoadingSpinner from "../shared/loading-spinner";
import Shared_ImageUpload from "../shared/image-upload";
import { useForm } from "../../hooks/form";
import { useHttpClient } from "../../hooks/http-client";
import AuthContext from "../../context/auth";

const Auth = ({ type, inputs, history }) => {
  const { login } = useContext(AuthContext);
  const [isLoading, error, sendRequest, clearError] = useHttpClient();
  const validationInputsIds = [
    ...inputs.map((input) => input.id),
    ...(type === "signup" ? ["image"] : []),
  ];
  const [formState, handleInputChange] = useForm(validationInputsIds, false);
  const authContent = type === "login" ? "Login" : "signup" ? "Signup" : "";
  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    if (type === "login") {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_SERVER_ENDPOINT}/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          },
        );
        login(responseData.userId, responseData.token);
        history.push("/");
      } catch (error) {}
    }
    if (type === "signup") {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_SERVER_ENDPOINT}/users/signup`,
          "POST",
          formData,
        );
        login(responseData.user, responseData.token);
        history.push("/");
      } catch (error) {}
    }
  };
  return (
    <Fragment>
      <Shared_ErrorModal error={error} handleClear={clearError} />
      <Shared_Card className="authentication">
        {isLoading && <Shared_LoadingSpinner asOverlay />}
        <h2>{authContent} Required</h2>
        <hr />
        <form onSubmit={handleAuthSubmit}>
          {inputs.map((input) => (
            <Shared_FormInput
              key={input.id}
              handleInputChange={handleInputChange}
              {...input}
            />
          ))}
          {type === "signup" && (
            <Shared_ImageUpload
              center
              id="image"
              handleFileInput={handleInputChange}
              errorMessage="Please provide an image."
            />
          )}
          <Shared_Button type="submit" disabled={!formState.isValid}>
            {authContent.toUpperCase()}
          </Shared_Button>
        </form>
      </Shared_Card>
    </Fragment>
  );
};

export default withRouter(Auth);
