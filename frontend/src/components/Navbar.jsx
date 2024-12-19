import { Link } from 'react-router-dom'
import { Container, Flex, Button, HStack, Text, Input, InputRightElement, InputGroup, IconButton} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.jsx';

const Navbar = () => {

    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    return (
        <Container maxW={"1140px"} px={4}>
            <Flex
                h={16}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDir={{
                    base:"column",
                    sm:"row"
                }}
                gap={{
                    sm: 24,
                    base: 2
                }}
            >
                <Text
                    fontSize={{ base:"25", sm:"32"}}
                    fontWeight={"bold"}
                    textTransform={"uppercase"}
                    textAlign={"center"}
                    bgGradient={"linear(to-r, orange.400, red.500)"}
                    bgClip={"text"}
                >
                    <Link to={"/"}>Coursite</Link>
                </Text>

                <form style={{ flexGrow: 1 }}>
                <InputGroup maxW="500px">
                    <Input
                    placeholder="Search courses..." 
                    bg="gray.800" 
                    color="gray.100"
                    />
                    <InputRightElement>
                    <IconButton
                        aria-label="Search"
                        icon={<SearchIcon />}
                        variant="ghost"
                    />
                    </InputRightElement>
                </InputGroup>
                </form>

                {
                    !isAuthenticated ? (
                        <HStack spacing={8} alignItems={"center"}>
                            <Button
                            onClick={() => navigate("/register")}
                            variant={"link"}
                            fontSize={{ base:"16", sm:"16"}}
                            fontWeight={"bold"}
                            textAlign={"center"}
                            bg={"gray.900"}
                            bgGradient={"linear(to-r, orange.400, red.500)"}
                            bgClip={"text"}
                            _hover={{bgGradient: "linear(to-r, yellow.400, pink.500)",
                                transform: "translateY(-5px)"}}
                            _active={{bg: "gray.900"}}
                            >
                                Register
                            </Button>
                            <Button
                                onClick={() => navigate("/login")}
                                variant={"link"}
                                fontSize={{ base:"16", sm:"16"}}
                                fontWeight={"bold"}
                                textAlign={"center"}
                                bg={"gray.900"}
                                bgGradient={"linear(to-r, orange.400, red.500)"}
                                bgClip={"text"}
                                _hover={{bgGradient: "linear(to-r, yellow.400, pink.500)",
                                    transform: "translateY(-5px)"}}
                                _active={{bg: "gray.900"}}
                            >
                                Log in
                            </Button>
                        </HStack>
                    ) : (
                        <HStack spacing={4} alignItems={"center"}>
                            <Button
                                onClick={() => navigate("/course/create")}
                                fontSize={{ base:"16", sm:"16"}}
                                fontWeight={"bold"}
                                textAlign={"center"}
                                bgGradient={"linear(to-r, orange.400, red.500)"}
                                bgClip={"text"}
                                _hover={{bgGradient: "linear(to-r, yellow.400, pink.500)",
                                    transform: "translateY(-5px)"}}
                                _active={{bg: "gray.900"}}
                            >
                                Start Teaching
                            </Button>
                            <Button
                            fontSize={{ base:"16", sm:"16"}}
                                fontWeight={"bold"}
                                textAlign={"center"}
                                bgGradient={"linear(to-r, orange.400, red.500)"}
                                bgClip={"text"}
                                _hover={{bgGradient: "linear(to-r, yellow.400, pink.500)",
                                    transform: "translateY(-5px)"}}
                                _active={{bg: "gray.900"}}
                            >
                                My courses
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant={"link"}
                                fontSize={{ base:"16", sm:"16"}}
                                fontWeight={"bold"}
                                textAlign={"center"}
                                bg={"gray.900"}
                                bgGradient={"linear(to-r, orange.400, red.500)"}
                                bgClip={"text"}
                                _hover={{bgGradient: "linear(to-r, yellow.400, pink.500)",
                                    transform: "translateY(-5px)"}}
                                _active={{bg: "gray.900"}}
                            >
                                Log out
                            </Button>
                    </HStack>
                    )
                }
            </Flex>

        </Container>
    )
}

export default Navbar;