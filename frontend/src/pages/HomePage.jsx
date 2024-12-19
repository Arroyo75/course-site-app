import { useEffect } from 'react';
import { Container, VStack, Text, SimpleGrid } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useCourseStore } from '../store/courseStore.jsx';
import CourseCard from '../components/CourseCard.jsx';

const HomePage = () => {

    const { fetchCourses, courses } = useCourseStore();

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);
    console.log("courses", courses);

    return (
        <Container maxW='container.xl' py={12}>
			<VStack spacing={8}>
				<Text
					fontSize={"30"}
					fontWeight={"bold"}
					bgGradient={"linear(to-r, orange.400, red.500)"}
					bgClip={"text"}
					textAlign={"center"}
				>
					Start learning
				</Text>

				<SimpleGrid
					columns={{
						base: 1,
						md: 2,
						lg: 3,
					}}
					spacing={10}
					w={"full"}
				>
					{courses.map((course) => (
						<CourseCard key={course._id} course={course} />
					))}
				</SimpleGrid>

				{courses.length === 0 && (
					<Text fontSize='xl' textAlign={"center"} fontWeight='bold' color='gray.500'>
						No courses found {" "}
						<Link to={"/create"}>
							<Text as='span' color='orange.400' _hover={{ textDecoration: "underline" }}>
								Create a course
							</Text>
						</Link>
					</Text>
				)}
			</VStack>
		</Container>
    )
}

export default HomePage;