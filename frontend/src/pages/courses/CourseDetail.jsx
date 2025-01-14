import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Text, Heading, VStack, Flex, Image, Spinner, HStack, Button, useToast, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';
import { useCourseStore } from '../../store/courseStore.jsx';
import { useAuthStore } from '../../store/authStore.jsx';
import { validateInput } from '../../utils/validation.jsx';
import LectureList from '../../components/LectureList.jsx';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { courses, fetchCourses, deleteCourse, updateCourse, enrollInCourse } = useCourseStore();
  const { user } = useAuthStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    title: '',
    description: '',
    image: ''
  });

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (courses.length === 0) {
        await fetchCourses();
      }

      const foundCourse = courses.find((course) => course._id === id);

      if (foundCourse) {
        setCourse(foundCourse);
        setUpdateFormData({
          title: foundCourse.title,
          description: foundCourse.description,
          image: foundCourse.image
        })
        if(user) {
          setIsEnrolled(foundCourse.students?.includes(user.id));
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [id, courses, fetchCourses, user]);

  if (loading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" color="orange.400" />
      </Box>
    );
  }

  if (!course) {
    return (
      <Box textAlign="center" py={20}>
        <Text fontSize="xl" fontWeight="bold" color="gray.500">
          Course not found.
        </Text>
      </Box>
    );
  }

  const isAuthor = course.author?._id === user?.id;

  const validationRules = {
    title: { min: 3, max: 55 },
    description: { min: 8, max: 300 },
    image: { max: 255 }
  };

  const handleValidation = () => {
    let isValid = true;
    Object.keys(updateFormData).forEach((field) => {
      const error = validateInput(field, updateFormData[field], validationRules[field]);
      if (error) {
        isValid = false;
        toast({
          title: 'Validation Error',
          description: `${field.charAt(0).toUpperCase() + field.slice(1)}: ${error}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    });
    return isValid;
  };

  const handleDelete = async (cid) => {
    const { success, message } = await deleteCourse(cid);
    if(!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } else {
      toast({
        title: 'Course Deleted',
        description: message,
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    }
    navigate("/");
  }

  const handleEdit = async (cid) => {
    if (!handleValidation()) return;
    const { success, message } = await updateCourse(cid, updateFormData);

    if(!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } else {
      toast({
        title: 'Course Updated',
        description: message,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    }
    onClose();
    await fetchCourses();
  }

  const handleEnroll = async (cid) => {
    if(!user) {
      navigate("/login");
      return;
    }

    const { success, message } = await enrollInCourse(cid);

    if(!success) {
      toast({
        title: 'Error',
        description: message,
        staus: 'error',
        duration: 3000,
        isCloseable: true
      });
    } else {
      setIsEnrolled(true);
      toast({
        title: 'Success',
        description: message,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sharedButtonStyle = {
    height: "50px",
    borderRadius: "md",
    textAlign: "center",
    lineHeight: "50px",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  return (
    <Box maxW="container.xl" mx="auto" mt={{ base: 6, sm: 7, md: 0}}>
      <Flex align={"flex-start"} flexDir={{ base: 'column', md: 'row'}}>
        <Box width={{base: "100%", md: "50%"}} py={12} px={6} bg="gray.900" color="white" rounded="lg" shadow="lg">
          <VStack spacing={6}>
            <Image src={course.image} alt={course.title} w="full" h={64} objectFit="cover" rounded="lg" />
            <Heading>{course.title}</Heading>
            <Text fontSize="md" color="gray.400">
              by {course.author?.name || "Unknown"}
            </Text>
            <Text fontSize="md">{course.description}</Text>
            {isAuthor ? (
              <HStack spacing={4}>
              <Button
                onClick={onOpen}
                bg="gray.900"
                color="blue.700"
                _hover={{ bg: 'gray.800' }}
                _active={{ bg: '#2d5382', color: 'gray.900' }}
                border="1px solid #2d5382"
                width={{base: '50vw', sm: '35vw', md: '20vw' , lg: '15vw', xl: '15vw'}}
                {...sharedButtonStyle}
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(course._id)}
                bg="gray.900"
                color="red.700"
                _hover={{ bg: 'gray.800' }}
                _active={{ bg: '#9a2c2d', color: 'gray.900' }}
                border="1px solid #9a2c2d"
                width={{base: '50vw', sm: '35vw', md: '20vw', lg: '15vw', xl: '15vw'}}
                {...sharedButtonStyle}
              >
                Delete
              </Button>
            </HStack>
            ) : ( !isEnrolled ? (
              <Button
                onClick={() => handleEnroll(course._id)}
                bg="gray.900"
                color="green.500"
                _hover={{ bg: 'gray.800' }}
                _active={{ bg: '#37a169', color: 'gray.900' }}
                border="1px solid #37a169"
                width={{base: '50vw', sm: '35vw', md: '20vw', lg: '15vw', xl: '15vw'}}
                {...sharedButtonStyle}
              >
                Enroll
              </Button>
            ) : (
              <Box 
                p={4} 
                bg="gray.900" 
                color="orange.500"
                border="1px solid #dd6b20"
                width={{base: '50vw', sm: '35vw', md: '20vw', lg: '15vw', xl: '15vw'}}
                {...sharedButtonStyle}
              >
                Enrolled
              </Box>
            ))}
          </VStack>
        </Box>
        <Box width={{base: "100%", md: "50%"}} py={12} px={6} bg="gray.900" color="white" rounded="lg" shadow="lg" display="flex" flexDirection="column" alignItems="center">
          <LectureList course={course} isEnrolled={isEnrolled}/>
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Update Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl color="white">
                <FormLabel>Title</FormLabel>
                <Input 
                  name="title"
                  value={updateFormData.title}
                  onChange={handleInputChange}
                  bg="gray.700"
                />
              </FormControl>
              <FormControl color="white">
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={updateFormData.description}
                  onChange={handleInputChange}
                  bg="gray.700"
                  rows={4}
                />
              </FormControl>
              <FormControl color="white">
                <FormLabel>Image URL</FormLabel>
                <Input
                  name="image"
                  value={updateFormData.image}
                  onChange={handleInputChange}
                  bg="gray.700"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter color="white">
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={() => handleEdit(course._id)}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CourseDetailPage;
