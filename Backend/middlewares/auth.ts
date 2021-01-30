import User from '@/models/User';
import jwt from "jsonwebtoken";


async function auth(req, res) : Promise<number> {

	try {

        const token = req.cookies['user-token'];

        // const token = req.headers.authorization.replace('Bearer ', '');

        // Xác thực token
        let flag : number
        jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {

            if (!err && payload) {
                const user = await User.findById(payload.id);

                console.log(user);

                if (!user) {
                    flag = 3;
                    // return res.status(401).json({
                    //     message: "Không đủ quyền truy cập"
                    // }) 
                }

            // return payload;
            } else {
                flag = 2;

                // return res.status(401).json({
                //    message: "Token không hợp lệ"
                // }) 
            }   

            flag = 1

        });

        return flag
    } catch (error) {
        console.log(error);
        return 0
    }
};

export default auth