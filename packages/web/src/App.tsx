diff --git a/packages/web/src/App.tsx b/packages/web/src/App.tsx
index c58ff95..3a3f1c9
--- a/packages/web/src/App.tsx
+++ b/packages/web/src/App.tsx
@@
-import Login from './pages/Login'
+import Login from './pages/Login'
+import Signup from './pages/Signup'
+import PasswordReset from './pages/PasswordReset'
+import Profile from './pages/Profile'
@@
-          <Route path="/dashboard/*" element={<Dashboard/>} />
+          <Route path="/dashboard/*" element={<Dashboard/>} />
+          <Route path="/dashboard/profile" element={<Profile/>} />
+          <Route path="/signup" element={<Signup/>} />
+          <Route path="/password-reset" element={<PasswordReset/>} />
