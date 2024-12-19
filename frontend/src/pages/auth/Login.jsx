import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useAuthStore } from "../../store/authStore.jsx"; // Zustand store for auth

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore(); // Zustand's login action
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        login(data.token, data.user);
        toast({
          title: "Login successful!",
          description: "Welcome back!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/"); // Redirect to home page
      } else {
        toast({
          title: "Login failed.",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: "Error.",
        description: "Something went wrong. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt="8" p="4" borderWidth="1px" borderRadius="lg">
      <Heading mb="6" textAlign="center">
        Login
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing="4">
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            isLoading={loading}
          >
            Log in
          </Button>
          <Text>
            Do not have an account?{" "}
            <Button
              variant="link"
              colorScheme="teal"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
