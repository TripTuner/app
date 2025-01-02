import { Routes } from '@angular/router';
import { inject } from '@angular/core';

export const routes: Routes = [
    {
        path: "",
        // redirectTo: '/home',
        loadChildren: () => import("./features/intro/intro.routes"),
        canActivate: [],
        pathMatch: 'full',
    },
    {
        path: "home",
        loadChildren: () => import("./features/home/home.routes"),
        canActivate: []
    },
    {
        path: "likes",
        loadChildren: () => import("./features/likes/likes.routes"),
        canActivate: []
    },
    {
        path: "build",
        loadChildren: () => import("./features/build/build.routes"),
        canActivate: []
    },
    {
        path: "community",
        loadChildren: () => import("./features/community/community.routes"),
        canActivate: []
    },
    {
        path: "profile",
        loadChildren: () => import("./features/profile/profile.routes"),
        canActivate: []
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: ''
    }
];
