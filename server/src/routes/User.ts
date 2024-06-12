import { Hono } from "hono";


export const userRoutes = new Hono()
.get('/', async (c) =>{
    return c.json('essaie')
})
  