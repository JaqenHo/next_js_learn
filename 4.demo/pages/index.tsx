import React from 'react'
import { FormComponentProps } from "antd/lib/form/Form";
import { ColumnProps } from 'antd/es/table';
//引用用户类型接口，主要为了API返回数据作类型转换
import { NextUser, PageData } from "../repositories/user-repository";
import axios from 'axios';
import {
    Form,
    Input,
    Tooltip,
    Icon,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    AutoComplete,
    Button,
    Modal,
    InputNumber,
    Table,
    Divider,
    message
} from 'antd';
import '../css/antd.less';
import '../css/style.less';


interface IProps extends FormComponentProps {

}

interface IState {
    modalVisible?: boolean;
    pageSize?: number;
    tableData?: Array<TableUser>;
    pagination?: any;
    formData?: {
        id?: number;
        name?: string;
        age?: number;
    };
}

//新建一个用户接口，这个接口为table的item格式约束
interface TableUser {
    key?: number,
    id?: number;
    name?: string;
    age?: number;
}

const formItemLayout = {
    labelCol: {
        xs: { span: 18 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

//封装table
class NextUserTable extends Table<TableUser> { }

class Home extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            modalVisible: false,
            pageSize: 2, //一页2条，是为了测试看到分页，我数据库不想做太多数据
            tableData: [],
            formData: {}
        };
    };

    //这个是ant design的列
    columns: ColumnProps<TableUser>[] = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={() =>this.handleEdit(record.id)}>编辑</a>
                    <Divider type="vertical" />
                    <a onClick={() =>this.doDelete(record.id)}>删除</a>
                </span>
            ),
        }
    ];

    componentDidMount?(): void {
        this.getData(1);
    }

    getData = async (index) => {
        let { data } = await axios.get(`/api/user`, {
            params: {
                index: index,
                pageSize: this.state.pageSize
            }
        });


        if (data.status !== 'ok') return; //or error message

        let pageData: PageData<NextUser> = data.data;

        const pagination = { ...this.state.pagination };
        pagination.total = pageData.totalCount;
        pagination.pageSize = this.state.pageSize;

        const users: Array<NextUser> = pageData.list;
        const tableData: Array<TableUser> = [];

        for (let user of users) {
            tableData.push({
                key: user.id,
                id: user.id,
                name: user.name,
                age: user.age
            });
        }

        this.setState({
            tableData: tableData,
            pagination
        });
    };


    //分页获取数据
    handleTableChange = async (pagination, filters, sorter) => {
        await this.getData(pagination.current);
    };

    //注意这里要写成'handleAdd = () => {}',假如普通写'handleAdd() {}'会引起this为undefined
    handleAdd = () => {
        this.setState({
            modalVisible: true,
            formData: {}
        });
    };

    handleEdit = async id => {
        let { data } = await axios.get(`/api/user/${id}`);
        if(data.status !== "ok") return; //show some error

        let user:NextUser = data.data;
        this.setState({
            modalVisible: true,
            formData: {
                id:id,
                name:user.name,
                age:user.age
            }
        });
    };

    closeModal = () => {
        this.setState({ modalVisible: false });
    }

    doDelete = async id =>{
        let { data } = await axios.delete(`/api/user/${id}`);

        if (data.status === "ok") {
            message.success('删除成功');
            this.getData(1);
        } else {
            message.error('删除失败');
        }
    };

    doEdit = async e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (err) return;

            //Received values of form: {name: "1231212312", age: 123}

            if (this.state.formData.id) {
                let { data } = await axios.put(`/api/user/${this.state.formData.id}`, values);

                if (data.status === "ok") {
                    message.success('修改成功');
                    this.setState({ 
                        modalVisible: false
                     });
                    this.getData(1);
                } else {
                    message.error('修改失败');
                }
            } else {
                let { data } = await axios.post(`/api/user`, values);

                if (data.status === "ok") {
                    message.success('添加成功');
                    this.setState({ modalVisible: false });
                } else {
                    message.error('添加失败');
                }
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="container">
                <div style={{ paddingLeft: "50px" }}>
                    <Button type="primary" onClick={this.handleAdd}>新增</Button>
                </div>
                <div style={{ padding: "20px 50px" }}>
                    <NextUserTable
                        dataSource={this.state.tableData}
                        columns={this.columns}
                        pagination={this.state.pagination}
                        onChange={this.handleTableChange}
                    />
                </div>


                <Modal
                    title="Basic Modal"
                    visible={this.state.modalVisible}
                    onCancel={this.closeModal}
                    footer={[
                        <Button form="form" key="submit" htmlType="submit">
                            Submit
                        </Button>
                    ]}
                >
                    <Form id="form" {...formItemLayout} onSubmit={this.doEdit}>
                        <Form.Item label="姓名">
                            {getFieldDecorator('name', {
                                initialValue: this.state.formData.name,
                                rules: [{ required: true, message: 'Please input your name!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="name"
                                />,
                            )}

                        </Form.Item>
                        <Form.Item label="年龄">
                            {getFieldDecorator('age', {
                                initialValue: this.state.formData.age,
                                rules: [{ required: true, message: 'Please input your age!' }],
                            })(
                                <InputNumber
                                    min={1}
                                    max={200}
                                    style={{ width: '100%', marginRight: '3%' }}
                                    placeholder="age"
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}


export default Form.create()(Home);