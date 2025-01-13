import { useState } from 'react'
import { Container, VStack, Heading, Box, Input, Button, useToast } from '@chakra-ui/react'
import { useCourseStore } from '../../store/courseStore.jsx';

const CreateCourse = () => {
    const [newCourse, setNewCourse] = useState({
       title: "",
       description: "",
       image: ""
    });

    const toast = useToast();

    const { createCourse } = useCourseStore();

    const handleAddCourse = async() => {
        const {success, message} = await createCourse(newCourse);
        if(!success) {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true
            })
        } else {
            toast({
                title: "Course Added",
                description: message,
                status: "success",
                duration: 3000,
                isClosable: true
            })
        }
        setNewCourse({title: "", description: "", image: ""});
        
    };

    return (
        <Container maxW={"container.sm"} mt={{ base: 20, sm: 20, md: 0}}>
            <VStack
                spacing={8}
            >
                <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8} >
                    Create new Course
                </Heading>

                <Box
                    w={"full"} bg={"gray.800"}
                    p={6} rounded={"lg"} shadow={"md"}
                >
                    <VStack spacing={4}>
                        <Input
                            placeholder='Course Title'
                            name='title'
                            value={newCourse.title}
                            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value})}
                        />
                        <Input
                            placeholder='Description'
                            name='description'
                            value={newCourse.description}
                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value})}
                        />
                        <Input
                            placeholder='Image URL'
                            name='image'
                            value={newCourse.image}
                            onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value})}
                        />
                        <Button colorScheme='orange' w='full' onClick={handleAddCourse}>
                            Add Course
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    )
}

export default CreateCourse