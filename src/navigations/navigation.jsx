import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Dashboard, CreateTree, TreeDetail, ManageTree } from '../pages';

export default function Navigation() {
    return (<Router>
        <div className='App-header'>
            <Suspense fallback={<div className='h1'>Loading...</div>}>
                <Routes>
                    <Route path="/"
                        element={<Dashboard />}
                    />
                    <Route path="/create-tree" element={<CreateTree />} />
                    <Route path="/tree-detail" element={<TreeDetail/>} />
                    <Route path="/manage-tree/:manage" element={<ManageTree />} />
                </Routes>
            </Suspense>

        </div>
    </Router>)
}
