diff --git a/packages/web/src/App.tsx b/packages/web/src/App.tsx
index c58ff95..0000000
--- a/packages/web/src/App.tsx
+++ b/packages/web/src/App.tsx
@@
 import Dashboard from './pages/Dashboard'
 import AdminDashboard from './pages/Admin'
+import CreateDesign from './pages/CreateDesign'
@@
           <Route path="/dashboard/*" element={<Dashboard/>} />
+          <Route path="/dashboard/create-design" element={<CreateDesign/>} />
