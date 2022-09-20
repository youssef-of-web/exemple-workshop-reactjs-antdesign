import {
  Badge,
  Card,
  Divider,
  Image,
  message,
  Modal,
  Rate,
  Skeleton,
  Spin,
  Table,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import "./App.css";
import { BsTrash, BsEye } from "react-icons/bs";
import axios from "axios";

function App() {
  const [product, setProduct] = useState([]);
  const [singleP, setSingleP] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { Title } = Typography;

  const DeleteHandler = async (id) => {
    await setProduct(product.filter((p) => p.id != id));
    message.success("Product Deleted");
  };
  const FetchSingleProduct = (id) => {
    axios.get(`https://fakestoreapi.com/products/${id}`).then((res) => {
      setSingleP(res.data);
    });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSingleP({});
  };
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_, record) => {
        return <Image width={100} src={record?.image} />;
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (_, { rating }) => {
        return <Rate disabled={true} allowHalf defaultValue={rating?.rate} />;
      },
    },
    {
      title: "Actions",
      dataIndex: "id",
      key: "id",
      render: (_, { id }) => {
        return (
          <>
            <BsTrash
              style={{ fontSize: "30px", color: "red", cursor: "pointer" }}
              onClick={() => DeleteHandler(id)}
            />
            <BsEye
              style={{ fontSize: "30px", color: "teal", cursor: "pointer" }}
              onClick={() => {
                showModal();
                FetchSingleProduct(id);
              }}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => setProduct(json));
  }, []);

  return (
    <div className="App">
      {product.length ? (
        <Table dataSource={product} columns={columns} />
      ) : (
        <Skeleton />
      )}

      <Modal
        title="Detail Product"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        {singleP?.id ? (
          <>
            <p>
              <div style={{ display: "flex" }}>
                <img src={singleP?.image} width="200px" />
                <div style={{ flexDirection: "column" }}>
                  <Title level={1}>{`${singleP?.price}$`}</Title>
                  <Badge.Ribbon text="Count">
                    <Card size="small">{singleP?.rating?.count}</Card>
                  </Badge.Ribbon>
                  <p style={{ fontSize: "40px" }}>
                    {Array(Math.round(singleP?.rating?.rate)).fill("⭐")}
                  </p>
                </div>
              </div>
            </p>
            <Divider />
            <p>
              <Title level={2}>{singleP?.title}</Title>
            </p>
            <p>
              <Title level={4}>{singleP?.category}</Title>
            </p>
            <p>{singleP?.description}</p>
          </>
        ) : (
          <Spin size="large" />
        )}
      </Modal>
    </div>
  );
}

export default App;
