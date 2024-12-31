import { useState } from 'react';
import { Link } from 'react-router-dom'
import { Container, Flex, Button, HStack, Text, useToast, Input, InputRightElement, InputGroup, IconButton} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.jsx';
import { useCourseStore } from '../store/courseStore.jsx';

const Navbar = () => {

    const [searchInput, setSearchInput] = useState('');
    const { searchCourses, setSearchQuery } = useCourseStore();
    const { isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    const handleSearch = async (e) => {
        e.preventDefault();

        if(!searchInput.trim()) return;

        try {
            setSearchQuery(searchInput);
            const result = await searchCourses(searchInput);

            if(!result.success) {
                toast({
                    title: 'Search failed',
                    description: result.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                })
            } else {
                navigate('/search');
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container maxW={"1140px"} px={4}>
            <Flex
                h={16}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDir={{
                    base:"column",
                    md:"row"
                }}
                gap={{
                    md: 24,
                    base: 2
                }}
            >
                <Text
                    fontSize={{ base:"25", md:"32"}}
                    fontWeight={"bold"}
                    textTransform={"uppercase"}
                    textAlign={"center"}
                    bgGradient={"linear(to-r, orange.400, red.500)"}
                    bgClip={"text"}
                >
                    <Link to={"/"}>Coursite</Link>
                </Text>

                <form onSubmit={handleSearch} style={{ flexGrow: 1 }}>
                <InputGroup maxW="500px">
                    <Input
                    placeholder="Search courses..." 
                    bg="gray.800" 
                    color="gray.100"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <InputRightElement>
                    <IconButton
                        aria-label="Search"
                        icon={<SearchIcon />}
                        variant="ghost"
                        type="submit"
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
                            fontSize={{ base:"16", md:"16"}}
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
                                fontSize={{ base:"16", md:"16"}}
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
                                fontSize={{ base:"16", md:"16"}}
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
                                onClick={() => navigate("/mycourses")}
                                fontSize={{ base:"16", md:"16"}}
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
                                fontSize={{ base:"16", md:"16"}}
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