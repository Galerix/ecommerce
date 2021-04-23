import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../../../hooks/useAuth";
import { createAddressApi, updateAddressApi } from "../../../api/address";
import { toast } from "react-toastify";

export default function AddressForm(props) {
  const [loading, setLoading] = useState(false);
  const { auth, logout } = useAuth();
  const { setShowModal, setReloadAddresses, newAddress, address } = props;

  const formik = useFormik({
    initialValues: initialValues(address),
    validationSchema: Yup.object(validationSchema()),
    onSubmit: async (formData) => {
      newAddress ? createAddress(formData) : updateAddress(formData);
    },
  });

  const createAddress = async (formData) => {
    setLoading(true);
    const formDataTemp = {
      ...formData,
      user: auth.idUser,
    };
    const response = await createAddressApi(formDataTemp, logout);
    if (!response) {
      toast.warning("Error al crear la direccion");
    } else {
      formik.resetForm();
      setReloadAddresses(true);
      setShowModal(false);
    }
    setLoading(false);
  };

  const updateAddress = async (formData) => {
    setLoading(true);
    const formDataTemp = {
      ...formData,
      user: auth.idUser,
    };
    const response = updateAddressApi(address._id, formDataTemp, logout);

    if (!response) {
      toast.warning("Error al actualizar la dirección");
      setLoading(false);
    } else {
      formik.resetForm();
      setReloadAddresses(true);
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Input
        name="title"
        type="text"
        label="Titulo de la dirección"
        placeholder="Titulo de la dirección"
        value={formik.values.title}
        onChange={formik.handleChange}
        error={formik.errors.title}
      />
      <Form.Group widths="equal">
        <Form.Input
          name="name"
          type="text"
          label="Nombre y Apellidos"
          placeholder="Nombre y Apellidos"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.errors.name}
        />
        <Form.Input
          name="address"
          type="text"
          label="Dirección"
          placeholder="Dirección"
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.errors.address}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          name="city"
          type="text"
          label="Ciudad"
          placeholder="Ciudad"
          value={formik.values.city}
          onChange={formik.handleChange}
          error={formik.errors.city}
        />
        <Form.Input
          name="state"
          type="text"
          label="Estado/Provincia/Región"
          placeholder="Estado/Provincia/Región"
          value={formik.values.state}
          onChange={formik.handleChange}
          error={formik.errors.state}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          name="postalCode"
          type="text"
          label="Código postal"
          placeholder="Código postal"
          value={formik.values.postalCode}
          onChange={formik.handleChange}
          error={formik.errors.postalCode}
        />
        <Form.Input
          name="phone"
          type="text"
          label="Número de teléfono"
          placeholder="Número de teléfono"
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={formik.errors.phone}
        />
      </Form.Group>
      <div className="actions">
        <Button className="submit" type="submit" loading={loading}>
          {newAddress ? "Crear dirección" : "Actualizar dirección"}
        </Button>
      </div>
    </Form>
  );
}

function initialValues(address) {
  return {
    title: address?.title || "",
    name: address?.name || "",
    address: address?.address || "",
    city: address?.city || "",
    state: address?.state || "",
    postalCode: address?.postalCode || "",
    phone: address?.phone || "",
  };
}

function validationSchema() {
  return {
    title: Yup.string().required(true),
    name: Yup.string().required(true),
    address: Yup.string().required(true),
    city: Yup.string().required(true),
    state: Yup.string().required(true),
    postalCode: Yup.string().required(true),
    phone: Yup.string().required(true),
  };
}
