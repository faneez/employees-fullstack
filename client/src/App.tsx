import React from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

import { Paths } from "./paths"

const App: React.FC = () => {
	const router = createBrowserRouter([
		{
			path: Paths.login,
			element: <h1>Login</h1>,
		},
		{
			path: Paths.home,
			element: <h1>home</h1>,
		},
		{
			path: Paths.register,
			element: <h1>Register</h1>,
		},
	])
	return <RouterProvider router={router} />
}

export default App
