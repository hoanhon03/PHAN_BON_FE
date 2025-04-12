import React, { useState } from 'react';
import { Modal, Button, Form, Input, Select, message } from 'antd';

const { Option } = Select;

const AddSupplierModal = ({ isOpen, onClose, onAddSupplier }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const supplierData = {
        supplierName: values.supplierName,
        describeSupplier: values.describeSupplier,
        status: values.status,
        supplierAddress: values.supplierAddress,
        supplierPhone: values.supplierPhone,
        supplierEmail: values.supplierEmail,
        listProductId: values.listProductId || []
      };
      await onAddSupplier(supplierData);
      message.success('Thêm nhà cung cấp thành công');
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm nhà cung cấp:", error);
      if (error.response) {
        if (error.response.status === 401) {
          message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          message.error(`Lỗi: ${error.response.data.message || 'Có lỗi xảy ra khi thêm nhà cung cấp'}`);
        }
      } else if (error.message === 'Token không tồn tại. Vui lòng đăng nhập lại.') {
        message.error(error.message);
      } else {
        message.error('Có lỗi xảy ra khi thêm nhà cung cấp');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Thêm nhà cung cấp mới"
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="supplierName"
          label="Tên nhà cung cấp"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="describeSupplier"
          label="Mô tả"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          initialValue="active"
        >
          <Select>
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="supplierAddress"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="supplierPhone"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="supplierEmail"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Thêm nhà cung cấp
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSupplierModal;