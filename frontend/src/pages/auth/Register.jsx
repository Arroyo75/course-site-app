import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, VStack, useToast} from "@chakra-ui/react";
import { useAuthStore } from "../../store/authStore.jsx";
import { validateInput } from "../../utils/validation.jsx";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const validationRules = {
    name: { min: 2, max: 50 },
    email: { max: 100},
    password: { min: 6, max: 128 }
  };

  const handleValidation = () => {
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const error = validateInput(field, formData[field], validationRules[field]);
      if (error) {
        isValid = false;
        toast({
          title: "Validation Error",
          description: `${field.charAt(0).toUpperCase() + field.slice(1)}: ${error}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });

    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidation()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const loginData = await loginRes.json();

        if (loginData.success) {
          login(loginData.token, loginData.user);

          toast({
            title: "Registration successful!",
            description: "Welcome to the platform!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          navigate("/");
        } else {
          throw new Error("Could not log in after registration");
        }
      } else {
        toast({
          title: "Registration failed.",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error.",
        description: error.message || "Something went wrong. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={{ base: 12, sm: 14, md: 8}} p="4" borderWidth="1px" borderRadius="lg">
      <Heading color="white" mb="6" textAlign="center">
        Register
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing="4">
          <FormControl isRequired color="white">
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired color="white">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired color="white">
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
            colorScheme="orange"
            width="full"
            isLoading={loading}
          >
            Register
          </Button>
          <Text color="white">
            Already have an account?{" "}
            <Button
              variant="link"
              colorScheme="orange"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Register;