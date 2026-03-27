import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import axios from "axios";
import { SmsSendResponse } from "../types/sms.reponse";

@Injectable()
export class smsService {
    private token: string;
    private readonly $axios = axios.create({
        baseURL: 'https://notify.eskiz.uz/api'
    });
    constructor(){}

    private async login(){
        try {
            const {data} = await this.$axios.post<{data: { token : string}}>(
                '/auth/login',
                {
                    email: "ibrahimoff.uz@gmail.com",
                    password: "x7FTih9l1g1aRGq4btMy7fOySY2yepdxcVHeQdg4",
                }
            )
            this.token = data.data.token
        } catch (error) {
            throw new HttpException(
                'Eskiz login failed' + (error?.response?.data?.message || 'Unknown error'),
                error?.response?.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    public async sendSms(message: string, to: string){
        try {
            if(!this.token){
                await this.login();
            }
            
            await this.$axios.post<SmsSendResponse>(
                '/message/sms/send',
                {
                    from: 4546,
                    message,
                    mobile_phone: to.replace(/\s+/g, ''),
                    callback_url: ''
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + this.token,
                    },
                },
            );

            return true;
        } catch (error) {
            throw new HttpException(
                'Sms yuborishda xatolik' + (error?.response?.data?.message || "Unknown error"),
                error?.response?.status || HttpStatus.BAD_REQUEST
            );
        };
    }
}