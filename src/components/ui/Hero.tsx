import React from 'react';
import { Button } from './Button';

export default function Hero() {
	return (
		<>
			<div className="flex items-center justify-start">
				<div className="flex-1 flex flex-col gap-6 items-start justify-start">
					<div className="flex flex-col gap-2">
						<h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r to-purple-400 via-purple-400 from-purple-800">
							Your cool hero text
						</h1>
						<h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
							is here
						</h1>
					</div>
					<div>
						<p>
							Lorem ipsum dolor,
							<strong> sit amet consectetur adipisicing</strong> elit. Nam
						</p>
						<p>
							similique aspernatur, odio alias itaque voluptates sequi officia
						</p>
					</div>
					<div className="text-brand-100">
						<p>💪 Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
						<p>🚀 Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
						<p>📈 Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
					</div>
					<div className="flex gap-8">
						<div>
							<Button
								href="#"
								className="inline-flex items-center px-12 py-3 shadow-sm text-base font-semibold rounded-md text-brand-900 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Lorem Ipsum
							</Button>
						</div>
						<div>
							<Button
								href="#"
								className="inline-flex items-center px-12 py-3 border border-gray-300 shadow-sm text-base font-semibold rounded-md text-gray-300 hover:bg-brand-500 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Lorem Ipsum
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
