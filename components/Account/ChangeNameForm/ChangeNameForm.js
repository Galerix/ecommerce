import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { updateUserApi } from "../../../api/user";

export default function ChangeNameForm(props) {
  const { user, logout, setReloadUser } = props;
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValues(user.name, user.lastname),
    validationSchema: Yup.object(validationSchema()),
    onSubmit: async (formData) => {
      setLoading(true);
      const response = await updateUserApi(user.id, formData, logout);
      if (!response) {
        toast.error("Error al actualizar el nombre y apellidos");
      } else {
        setReloadUser(true);
        toast.success("Nombre actualizado");
      }
      setLoading(false);
      setReloadUser(false);
    },
  });

  return (
    <div className="change-name-form">
      <h4>Cambia tu nombre y apellidos</h4>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group widths="equal">
          <Form.Input
            name="name"
            placeholder="Tu nuevo nombre"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.errors.name}
          />
          <Form.Input
            name="lastname"
            placeholder="Tus nuevos apellidos"
            value={formik.values.lastname}
            onChange={formik.handleChange}
            error={formik.errors.lastname}
          />
        </Form.Group>
        <Button className="submit" type="submit" loading={loading}>
          Actualizar
        </Button>
      </Form>
    </div>
  );
}

function initialValues(name, lastname) {
  return {
    name: name || "",
    lastname: lastname || "",
  };
}

function validationSchema() {
  return {
    name: Yup.string().required(true),
    lastname: Yup.string().required(true),
  };
}
