import { CommonRoutesConfig } from "../routes/routes.config";
import { Request, Response, NextFunction, Application } from "express";
import axios, { AxiosResponse } from "axios";

interface Post {
  userId: Number;
  id: Number;
  title: String;
  body: String;
}

export class PostRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "postRoutes");
  }
  configureRoutes() {
    // (we'll add the actual route configuration here next)
    this.app
      .route(`/posts`)
      .get(async (req: Request, res: Response) => {
        let result: AxiosResponse = await axios.get(
          `https://jsonplaceholder.typicode.com/posts`
        );
        let posts: [Post] = result.data;
        return res.status(200).json({
          message: posts,
        });
      })
      .post(async (req: Request, res: Response) => {
        let title: string = req.body.title;
        let body: string = req.body.body;
        let response: AxiosResponse = await axios.post(
          `https://jsonplaceholder.typicode.com/posts`,
          {
            title,
            body,
          }
        );
        return res.status(200).json({
          message: response.data,
        });
      });

    this.app
      .route(`/posts/:id`)
      .all((req: Request, res: Response, next: NextFunction) => {
        next();
      })
      .get(async (req: Request, res: Response) => {
        let id: string = req.params.id;
        let result: AxiosResponse = await axios.get(
          `https://jsonplaceholder.typicode.com/posts/${id}`
        );
        let post: Post = result.data;
        return res.status(200).json({
          message: post,
        });
      })
      .put(async (req: Request, res: Response) => {
        let id: string = req.params.id;
        let title: string = req.body.title ?? null;
        let body: string = req.body.body ?? null;
        let response: AxiosResponse = await axios.put(
          `https://jsonplaceholder.typicode.com/posts/${id}`,
          {
            ...(title && { title }),
            ...(body && { body }),
          }
        );
        return res.status(200).json({
          message: response.data,
        });
      })
      .patch((req: Request, res: Response) => {
        res.status(200).send(`PATCH requested for id ${req.params.userId}`);
      })
      .delete(async (req: Request, res: Response) => {
        let id: string = req.params.id;
        let response: AxiosResponse = await axios.delete(
          `https://jsonplaceholder.typicode.com/posts/${id}`
        );
        return res.status(200).json({
          message: "post deleted successfully",
        });
      });
    return this.app;
  }
}
