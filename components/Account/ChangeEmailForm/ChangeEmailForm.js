import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { updateUserApi } from "../../../api/user";

export default function ChangeEmailForm(props) {
  const { user, logout, setReloadUser } = props;
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(validationSchema()),
    onSubmit: async (formData) => {
      setLoading(true);
      const response = await updateUserApi(user.id, formData, logout);
      if (!response || response?.statusCode === 400) {
        toast.error("Error al actualizar el email");
      } else {
        setReloadUser(true);
        toast.success("Email actualizado");
        formik.handleReset();
      }
      setLoading(false);
      setReloadUser(false);
    },
  });

  return (
    <div className="change-email-form">
      <h4>
        Cambia tu email <span>(Tu email actual : {user.email})</span>
      </h4>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group widths="equal">
          <Form.Input
            name="email"
            placeholder="Tu nuevo email"
            type="text"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.errors.email}
          />
          <Form.Input
            name="repeatEmail"
            placeholder="Confirma tu nuevo email"
            type="text"
            value={formik.values.repeatEmail}
            onChange={formik.handleChange}
            error={formik.errors.repeatEmail}
          />
        </Form.Group>
        <Button className="submit" type="submit" loading={loading}>
          Actualizar
        </Button>
      </Form>
    </div>
  );
}

function initialValues() {
  return {
    email: "",
    repeatEmail: "",
  };
}

function validationSchema() {
  return {
    email: Yup.string().email(true).required(true),
    repeatEmail: Yup.string()
      .email(true)
      .equalTo(Yup.ref("email"), true)
      .required(true),
  };
}

function equalTo(ref, msg) {
  return Yup.mixed().test({
    name: "equalTo",
    exclusive: false,
    message: msg || "${path} must be the same as ${reference}",
    params: {
      reference: ref.path,
    },
    test: function (value) {
      return value === this.resolve(ref);
    },
  });
}
Yup.addMethod(Yup.string, "equalTo", equalTo);
