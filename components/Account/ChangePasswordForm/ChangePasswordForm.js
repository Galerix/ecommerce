import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { updateUserApi } from "../../../api/user";

export default function ChangePasswordForm(props) {
  const { user, logout } = props;
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(validationSchema()),
    onSubmit: async (formData) => {
      setLoading(true);
      const response = await updateUserApi(user.id, formData, logout);
      if (!response || response?.statusCode === 400) {
        toast.error("Error al actualizar la contraseña");
      } else {
        toast.success("Contraseña actualizada");
        formik.handleReset();
      }
      setLoading(false);
    },
  });

  return (
    <div className="change-email-form">
      <h4>Cambia tu contraseña</h4>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group widths="equal">
          <Form.Input
            name="password"
            type="password"
            placeholder="Tu nueva contraseña"
            onChange={formik.handleChange}
            error={formik.errors.password}
          />
          <Form.Input
            name="repeatPassword"
            type="password"
            placeholder="Confirma tu nueva contraseña"
            onChange={formik.handleChange}
            error={formik.errors.repeatPassword}
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
    password: "",
    repeatPassword: "",
  };
}

function validationSchema() {
  return {
    password: Yup.string().required(true),
    repeatPassword: Yup.string()
      .equalTo(Yup.ref("password"), true)
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
