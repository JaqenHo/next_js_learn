import { Client } from 'pg';
import config from "../config.json";

//这个接口应该单独弄出去，弄个文件夹夹叫utility之类放着，因为后续肯定不止这个地方用到。
export interface PageData<T> {
    index?: number;
    pageSize?: number;
    totalCount?: number;
    list?: Array<T>;
}


export interface NextUser {
    id?: number;
    name?: string;
    age?: number;
    createdDateTime?: Date;
}

export class UserRepository {
    //分页获取所有用户
    async getAllUser(index: number, pageSize: number): Promise<PageData<NextUser>> {
        const client = new Client(config.dbCofing);
        await client.connect();

        try {
            let pageData: PageData<NextUser> = {}
            pageData.index = index;
            pageData.pageSize = pageSize;

            //以下加await的话，会同步等待结果返回
            const totalCount = await client.query(
                `SELECT count(*) as total_count from next_user`
            );
            pageData.totalCount = parseInt(totalCount.rows[0].total_count);

            const result = await client.query(
                `select id,name,age,created_date_time from next_user order by id desc limit ${pageSize} offset ${(pageSize * (index - 1))}; `
            );

            let nextUsers: NextUser[] = [];
            for (const row of result.rows) {
                let nextUser: NextUser = {
                    id: row.id as number,
                    name: row.name as string,
                    age: row.age as number,
                    createdDateTime: row.created_date_time as Date
                };

                nextUsers.push(nextUser);
            }
            pageData.list = nextUsers;

            return pageData;

        }  catch(e){
            console.log(e);
        }
        finally {
            await client.end();
        }
    }

    //根据id获取用户
    async getUser(id: number): Promise<NextUser> {
        const client = new Client(config.dbCofing);
        await client.connect();

        try {

            const result = await client.query(
                `select id,name,age,created_date_time from next_user where id = $1`, [id]
            );

            let nextUser: NextUser = null;
            if(result.rows.length > 0){
                nextUser = {
                    id: result.rows[0].id as number,
                    name: result.rows[0].name as string,
                    age: result.rows[0].age as number,
                    createdDateTime: result.rows[0].created_date_time as Date
                };
            }
            
            return nextUser;
        } finally {
            await client.end();
        }
    }

    //添加用户
    async addUser(user: NextUser) {
        const client = new Client(config.dbCofing);
        await client.connect();

        try {
            await client.query(
                `INSERT INTO public.next_user ("name", age, created_date_time) VALUES($1, $2, $3);`, [user.name, user.age, new Date()]
            );
        } finally {
            await client.end();
        }
    }

    //更新用户
    async updateUser(user: NextUser) {
        const client = new Client(config.dbCofing);
        await client.connect();

        try {
            await client.query(
                `UPDATE public.next_user SET "name"=$1, age=$2 WHERE id=$3;
            `, [user.name, user.age,user.id]
            );
        } finally {
            await client.end();
        }
    }

    //删除用户
    async deleteUser(id: number) {
        const client = new Client(config.dbCofing);
        await client.connect();

        try {
            await client.query(
                `delete from next_user where id = $1`, [id]
            );
        } finally {
            await client.end();
        }
    }

}
