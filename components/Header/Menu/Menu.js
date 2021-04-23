import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Container, Menu, Grid, Icon } from "semantic-ui-react";
import BasicModal from "../../Modal/BasicModal";
import Auth from "../../Auth";
import useAuth from "../../../hooks/useAuth";
import { getPlatformsApi } from "../../../api/platforms";
import { map } from "lodash";

export default function MenuWeb() {
  const [platforms, setPlatforms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("Iniciar sesión");
  const { auth, logout } = useAuth();

  const onShowModal = () => setShowModal(true);
  const onCloseModal = () => setShowModal(false);

  useEffect(() => {
    (async () => {
      const response = await getPlatformsApi();
      setPlatforms(response || []);
    })();
  }, []);

  return (
    <div className="menu">
      <Container>
        <Grid>
          <Grid.Column className="menu__left" width={6}>
            <MenuPlatforms platforms={platforms} />
          </Grid.Column>
          <Grid.Column className="menu__right" width={10}>
            <MenuOptions
              onShowModal={onShowModal}
              auth={auth}
              logout={logout}
            />
          </Grid.Column>
        </Grid>
      </Container>
      <BasicModal
        show={showModal}
        setShow={setShowModal}
        title={titleModal}
        size="small"
      >
        <Auth onCloseModal={onCloseModal} setTitleModal={setTitleModal} />
      </BasicModal>
    </div>
  );
}

function MenuPlatforms(props) {
  const { platforms } = props;

  return (
    <Menu>
      {map(platforms, (platform) => (
        <Link href={`/games/${platform.url}`} key={platform._id}>
          <Menu.Item as="a" name={platform.url}>
            {platform.title}
          </Menu.Item>
        </Link>
      ))}
    </Menu>
  );
}

function MenuOptions(props) {
  const { onShowModal, auth, logout } = props;
  return (
    <Menu>
      {auth ? (
        <>
          <Link href="/orders">
            <Menu.Item as="a">
              <Icon name="game" />
              Mis pedidos
            </Menu.Item>
          </Link>
          <Link href="/wishlist">
            <Menu.Item as="a">
              <Icon name="heart outline" />
              Juegos Deseados
            </Menu.Item>
          </Link>
          <Link href="/account">
            <Menu.Item as="a">
              <Icon name="user outline" />
              Mi Cuenta
            </Menu.Item>
          </Link>
          <Link href="/cart">
            <Menu.Item as="a" className="m-0">
              <Icon name="cart" />
            </Menu.Item>
          </Link>
          <Menu.Item onClick={logout} className="m-0">
            <Icon name="power off" />
          </Menu.Item>
        </>
      ) : (
        <Menu.Item onClick={onShowModal}>
          <Icon name="user outline" />
          Iniciar sesión
        </Menu.Item>
      )}
    </Menu>
  );
}
