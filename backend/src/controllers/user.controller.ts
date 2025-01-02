import * as koa from 'koa';
import { Controller } from "@tsoa/runtime";
import { Body, Get, OperationId, Post, Request, Response, Route, Security, Tags } from "tsoa";

import { User } from "../entities/user.entity";
import { UserLogin, UserPublic, UserRegister } from "../interfaces/user.interfaces";
import { createUserSchema } from "../entities/user.schema";
import { redis } from "../server";

import * as UserService from "../services/user.service";
import * as ValidationService from "../services/validate.service";
import * as crypto from "../utils/crypto";


@Route('auth')
export class UserController extends Controller {
    @Post('/register')
    @Tags("BackendApi")
    @OperationId("register")
    public async register(
        @Body() dto: UserRegister
    ): Promise<string> {
        const user = UserService.createNewUserModel(dto);
        
        await ValidationService.validateRequest(user, createUserSchema, [
            'name',
            'email',
            'password'
        ]);
        await UserService.checkIfUserAlreadyExists({ email: user.email });
        await UserService.saveNewUser(user);
        
        const token = crypto.generateBearerToken();
        const context = UserService.createNewServerSideUserContext(user);
        
        await redis.set(token, JSON.stringify(context));
        
        return 'Bearer: ' + token;
    }
    
    @Post("login")
    @Tags("BackendApi")
    @Response<string>(200, "succeed")
    @OperationId("login")
    public async login(
        @Body() dto: UserLogin
    ): Promise<string> {
        const user = <User>await UserService.findUser({ where: { email: dto.email } }, false);
        
        await UserService.checkIfUserPasswordCorrect(user, dto.password);
        
        const token = crypto.generateBearerToken();
        const context = UserService.createNewServerSideUserContext(user);
        
        await redis.set(token, JSON.stringify(context));
        
        return 'Bearer: ' + token;
    }
    
    @Get("profile")
    @Tags("BackendApi")
    @Response<UserPublic>(200, "succeed")
    @OperationId("profile")
    @Security('auth')
    public async profile(
        @Request() request: koa.Request
    ): Promise<UserPublic> {
        const myContext = request.ctx.myContext;
        return await UserService.findUser({ where: { email: myContext.email } });
    }
}